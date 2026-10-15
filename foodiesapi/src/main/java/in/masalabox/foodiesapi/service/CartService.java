package in.masalabox.foodiesapi.service;

import in.masalabox.foodiesapi.io.CartRequest;
import in.masalabox.foodiesapi.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);

    void deleteItemFromCart(String foodId);

}
