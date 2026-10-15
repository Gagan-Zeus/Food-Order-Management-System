package in.masalabox.foodiesapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import in.masalabox.foodiesapi.entity.FoodEntity;
import in.masalabox.foodiesapi.repository.CartRepository;
import in.masalabox.foodiesapi.repository.FoodRepository; 
import in.masalabox.foodiesapi.io.OrderItem; 
import in.masalabox.foodiesapi.entity.OrderEntity;
import in.masalabox.foodiesapi.io.OrderRequest;
import in.masalabox.foodiesapi.io.OrderResponse;
import in.masalabox.foodiesapi.io.PaymentOrderResponse;
import in.masalabox.foodiesapi.io.PaymentVerificationRequest;
import in.masalabox.foodiesapi.io.PaymentStatusRequest;
import in.masalabox.foodiesapi.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final userService userService; 
    private final FoodRepository foodRepository; 
    private final DriverSimulatorService deliverySimulationService;
    private final ObjectMapper objectMapper;

    private static final String RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";
    private static final HttpClient RAZORPAY_HTTP_CLIENT = HttpClient.newHttpClient();

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private double recalculateAmount(List<OrderItem> orderedItems) {
        double totalAmount = 0.0;
        for (OrderItem item : orderedItems) {
            FoodEntity foodItem = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food item not found: " + item.getFoodId()));
            
            item.setPrice(foodItem.getPrice());
            if (item.getName() == null || item.getName().isBlank()) {
                item.setName(foodItem.getName());
            }
            if (item.getCategory() == null || item.getCategory().isBlank()) {
                item.setCategory(foodItem.getCategory());
            }
            if (item.getImageUrl() == null || item.getImageUrl().isBlank()) {
                item.setImageUrl(foodItem.getImageUrl());
            }
            totalAmount += foodItem.getPrice() * item.getQuantity();
        }
        return totalAmount;
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    private OrderResponse convertOrderEntityToResponse(OrderEntity order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userAddress(order.getUserAddress())
                .amount(order.getAmount())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .orderedItems(order.getOrderedItems())
                .build();
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream()
                .filter(order -> !"pending".equalsIgnoreCase(order.getPaymentStatus())
                        && !"Pending Payment".equalsIgnoreCase(order.getOrderStatus()))
                .map(this::convertOrderEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
       
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream()
                .map(this::convertOrderEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);

       if ("Out for Delivery".equalsIgnoreCase(status)) {
        System.out.println("✅ Starting driver simulation");
        deliverySimulationService.startDeliverySimulation(orderId);
    } else {
        System.out.println("❌ Status did not match Out for Delivery");
    }
    }


    @Override
    public PaymentOrderResponse createPaymentOrder(OrderRequest request) {
        String loggedInUserId = userService.findByUserId();

        if (request == null || request.getOrderedItems() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart items are required");
        }

        List<OrderItem> validOrderItems = request.getOrderedItems().stream()
                .filter(item -> item.getQuantity() > 0)
                .collect(Collectors.toList());

        if (validOrderItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart cannot be empty");
        }

        
        double subtotal = recalculateAmount(validOrderItems);
        double tax = subtotal * 0.10;      // 10% tax
        double shipping = (subtotal > 0) ? 10.00 : 0.00; // $10 shipping
        double totalAmount = subtotal + tax + shipping;

        
        OrderEntity newOrder = convertToEntity(request);
        newOrder.setUserId(loggedInUserId);
        newOrder.setAmount(totalAmount); // Use the new secure total
        newOrder.setOrderStatus("Pending Payment");
        newOrder.setPaymentStatus("pending");
        newOrder.setOrderedItems(validOrderItems);
        OrderEntity savedOrder = orderRepository.save(newOrder);
        String orderId = savedOrder.getId();

        long amountInPaise = Math.round(totalAmount * 100);
        try {
            String razorpayOrderId = createRazorpayOrder(orderId, amountInPaise);
            savedOrder.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(savedOrder);

            return new PaymentOrderResponse(
                    razorpayKeyId,
                    razorpayOrderId,
                    amountInPaise,
                    "INR",
                    orderId
            );
        } catch (RuntimeException exception) {
            savedOrder.setPaymentStatus("failed");
            savedOrder.setOrderStatus("Payment Failed");
            orderRepository.save(savedOrder);
            throw exception;
        }
    }

    @Override
    public void confirmOrderPayment(PaymentVerificationRequest request) {
        if (request == null || isBlank(request.getOrderId())
                || isBlank(request.getRazorpayOrderId())
                || isBlank(request.getRazorpayPaymentId())
                || isBlank(request.getRazorpaySignature())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment verification details are required");
        }

        String loggedInUserId = userService.findByUserId();
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!loggedInUserId.equals(order.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot confirm this order");
        }

        if (!request.getRazorpayOrderId().equals(order.getRazorpayOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment order does not match");
        }

        if (!isValidRazorpaySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment signature");
        }

        if ("succeeded".equals(order.getPaymentStatus())) {
            return;
        }

        order.setRazorpayPaymentId(request.getRazorpayPaymentId());
        order.setPaymentStatus("succeeded"); 
        order.setOrderStatus("Paid");
        orderRepository.save(order);

       
        cartRepository.deleteByUserId(order.getUserId());

    }

    @Override
    public void updatePaymentStatus(PaymentStatusRequest request) {
        if (request == null || isBlank(request.getOrderId()) || isBlank(request.getRazorpayOrderId())
                || isBlank(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment status details are required");
        }

        String requestedStatus = request.getStatus().trim().toLowerCase();
        if (!"cancelled".equals(requestedStatus) && !"failed".equals(requestedStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment status");
        }

        String loggedInUserId = userService.findByUserId();
        OrderEntity order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!loggedInUserId.equals(order.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot update this order");
        }

        if (!request.getRazorpayOrderId().equals(order.getRazorpayOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment order does not match");
        }

        // Razorpay can emit both payment.failed and modal.ondismiss. Never
        // overwrite a terminal state or a payment that was already verified.
        String currentStatus = order.getPaymentStatus() == null
                ? ""
                : order.getPaymentStatus().trim().toLowerCase();
        if ("succeeded".equals(currentStatus) || "failed".equals(currentStatus)
                || "cancelled".equals(currentStatus)) {
            return;
        }

        order.setPaymentStatus(requestedStatus);
        order.setOrderStatus("failed".equals(requestedStatus) ? "Payment Failed" : "Payment Cancelled");
        orderRepository.save(order);
    }

    private String createRazorpayOrder(String receipt, long amountInPaise) {
        try {
            String credentials = Base64.getEncoder().encodeToString(
                    (razorpayKeyId + ":" + razorpayKeySecret).getBytes(StandardCharsets.UTF_8));
            String requestBody = objectMapper.createObjectNode()
                    .put("amount", amountInPaise)
                    .put("currency", "INR")
                    .put("receipt", receipt)
                    .toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RAZORPAY_ORDERS_URL))
                    .header("Authorization", "Basic " + credentials)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = RAZORPAY_HTTP_CLIENT.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Razorpay could not create a payment order"
                );
            }

            JsonNode responseBody = objectMapper.readTree(response.body());
            String orderId = responseBody.path("id").asText(null);
            if (isBlank(orderId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Razorpay returned an invalid payment order"
                );
            }
            return orderId;
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to connect to Razorpay",
                    exception
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Razorpay request was interrupted",
                    exception
            );
        }
    }

    private boolean isValidRazorpaySignature(String orderId, String paymentId, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            ));
            byte[] digest = mac.doFinal((orderId + "|" + paymentId).getBytes(StandardCharsets.UTF_8));
            String expectedSignature = HexFormat.of().formatHex(digest);
            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (GeneralSecurityException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to verify payment signature",
                    exception
            );
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
