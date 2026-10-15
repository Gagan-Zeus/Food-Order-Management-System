package in.masalabox.foodiesapi.io;

import lombok.Data;

@Data
public class PaymentStatusRequest {
    private String orderId;
    private String razorpayOrderId;
    private String status;
}
