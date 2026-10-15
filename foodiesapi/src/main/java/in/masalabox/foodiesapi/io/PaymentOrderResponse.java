package in.masalabox.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentOrderResponse {
    private String keyId;
    private String razorpayOrderId;
    private long amount;
    private String currency;
    private String orderId;
}
