package in.masalabox.foodiesapi.service;


import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import in.masalabox.foodiesapi.entity.UserEntity;
import in.masalabox.foodiesapi.io.UserRequest;
import in.masalabox.foodiesapi.io.UserResponse;
import in.masalabox.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements userService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.findFirstByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        UserEntity newUser = convertToEntity(request);
        newUser.setEmail(normalizedEmail);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    private UserEntity convertToEntity(UserRequest request){
        return UserEntity.builder()
            .email(request.getEmail().trim().toLowerCase())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName() != null ? request.getName().trim() : "")
            .build();

    }

    private UserResponse convertToResponse(UserEntity registeredUser){
        return UserResponse.builder()
            .id(registeredUser.getId())
            .name(registeredUser.getName())
            .email(registeredUser.getEmail())
            .build();
    }

    @Override
    public String findByUserId() {
        var auth = authenticationFacade.getAuthentication();
    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not logged in");
    }
    String loggedInUserEmail = auth.getName();
    UserEntity loggedInUser = userRepository.findFirstByEmailIgnoreCase(loggedInUserEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + loggedInUserEmail));
    return loggedInUser.getId();
    }
}
