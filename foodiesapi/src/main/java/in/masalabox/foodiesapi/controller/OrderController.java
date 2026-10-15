package in.masalabox.foodiesapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import in.masalabox.foodiesapi.io.OrderRequest;
import in.masalabox.foodiesapi.io.OrderResponse;
import in.masalabox.foodiesapi.io.PaymentOrderResponse;
import in.masalabox.foodiesapi.io.PaymentVerificationRequest;
import in.masalabox.foodiesapi.io.PaymentStatusRequest;
import in.masalabox.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create-payment-order")
    public PaymentOrderResponse createPaymentOrder(@RequestBody OrderRequest request) {
        return orderService.createPaymentOrder(request);
    }

    @PostMapping("/confirm")
    public void confirmOrder(@RequestBody PaymentVerificationRequest request) {
        orderService.confirmOrderPayment(request);
    }

    @PostMapping("/cancel-payment")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updatePaymentStatus(@RequestBody PaymentStatusRequest request) {
        orderService.updatePaymentStatus(request);
    }
   

    @GetMapping
    public List<OrderResponse> getOrders(){
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId){
        orderService.removeOrder(orderId);
    }

    //admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers(){
        return orderService.getOrdersOfAllUsers();
    }

    //admin panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        String status = body.get("status"); 
        orderService.updateOrderStatus(orderId, status);
    }
}
