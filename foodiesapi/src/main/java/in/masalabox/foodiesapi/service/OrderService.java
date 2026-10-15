package in.masalabox.foodiesapi.service;

import java.util.List;

import in.masalabox.foodiesapi.io.OrderRequest;
import in.masalabox.foodiesapi.io.OrderResponse;
import in.masalabox.foodiesapi.io.PaymentOrderResponse;
import in.masalabox.foodiesapi.io.PaymentVerificationRequest;
import in.masalabox.foodiesapi.io.PaymentStatusRequest;

public interface OrderService {

    PaymentOrderResponse createPaymentOrder(OrderRequest request);

    void confirmOrderPayment(PaymentVerificationRequest request);

    void updatePaymentStatus(PaymentStatusRequest request);

    
    List<OrderResponse> getUserOrders();
    void removeOrder(String orderId);
    List<OrderResponse> getOrdersOfAllUsers();
    void updateOrderStatus(String orderId, String status);
}
