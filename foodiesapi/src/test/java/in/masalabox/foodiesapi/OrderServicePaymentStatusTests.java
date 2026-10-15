package in.masalabox.foodiesapi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.ObjectMapper;

import in.masalabox.foodiesapi.entity.OrderEntity;
import in.masalabox.foodiesapi.io.PaymentStatusRequest;
import in.masalabox.foodiesapi.repository.CartRepository;
import in.masalabox.foodiesapi.repository.FoodRepository;
import in.masalabox.foodiesapi.repository.OrderRepository;
import in.masalabox.foodiesapi.service.DriverSimulatorService;
import in.masalabox.foodiesapi.service.OrderServiceImpl;
import in.masalabox.foodiesapi.service.userService;

@ExtendWith(MockitoExtension.class)
class OrderServicePaymentStatusTests {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private userService userService;

    @Mock
    private FoodRepository foodRepository;

    @Mock
    private DriverSimulatorService deliverySimulationService;

    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(
                orderRepository,
                cartRepository,
                userService,
                foodRepository,
                deliverySimulationService,
                new ObjectMapper());
    }

    @Test
    void cancellingPendingPaymentUpdatesBothStatuses() {
        OrderEntity order = OrderEntity.builder()
                .id("order-1")
                .userId("user-1")
                .razorpayOrderId("pay-order-1")
                .paymentStatus("pending")
                .orderStatus("Pending Payment")
                .build();
        PaymentStatusRequest request = request("order-1", "pay-order-1", "cancelled");
        when(userService.findByUserId()).thenReturn("user-1");
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));

        orderService.updatePaymentStatus(request);

        assertEquals("cancelled", order.getPaymentStatus());
        assertEquals("Payment Cancelled", order.getOrderStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void terminalPaymentCannotBeDowngraded() {
        OrderEntity order = OrderEntity.builder()
                .id("order-2")
                .userId("user-1")
                .razorpayOrderId("pay-order-2")
                .paymentStatus("succeeded")
                .orderStatus("Paid")
                .build();
        when(userService.findByUserId()).thenReturn("user-1");
        when(orderRepository.findById("order-2")).thenReturn(Optional.of(order));

        orderService.updatePaymentStatus(request("order-2", "pay-order-2", "cancelled"));

        assertEquals("succeeded", order.getPaymentStatus());
        assertEquals("Paid", order.getOrderStatus());
        verify(orderRepository, never()).save(order);
    }

    @Test
    void getUserOrdersFiltersOutPendingPaymentOrders() {
        OrderEntity pendingOrder = OrderEntity.builder()
                .id("order-pending")
                .userId("user-1")
                .paymentStatus("pending")
                .orderStatus("Pending Payment")
                .build();
        OrderEntity paidOrder = OrderEntity.builder()
                .id("order-paid")
                .userId("user-1")
                .paymentStatus("succeeded")
                .orderStatus("Paid")
                .build();

        when(userService.findByUserId()).thenReturn("user-1");
        when(orderRepository.findByUserId("user-1")).thenReturn(java.util.List.of(pendingOrder, paidOrder));

        java.util.List<in.masalabox.foodiesapi.io.OrderResponse> result = orderService.getUserOrders();

        assertEquals(1, result.size());
        assertEquals("order-paid", result.get(0).getId());
    }

    private PaymentStatusRequest request(String orderId, String razorpayOrderId, String status) {
        PaymentStatusRequest request = new PaymentStatusRequest();
        request.setOrderId(orderId);
        request.setRazorpayOrderId(razorpayOrderId);
        request.setStatus(status);
        return request;
    }
}
