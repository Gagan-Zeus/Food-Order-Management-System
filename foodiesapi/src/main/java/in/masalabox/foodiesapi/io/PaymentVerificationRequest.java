package in.masalabox.foodiesapi.io;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private String orderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
