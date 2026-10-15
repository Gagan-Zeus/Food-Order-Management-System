package in.masalabox.foodiesapi.service;

import in.masalabox.foodiesapi.io.UserRequest;
import in.masalabox.foodiesapi.io.UserResponse;

public interface userService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
