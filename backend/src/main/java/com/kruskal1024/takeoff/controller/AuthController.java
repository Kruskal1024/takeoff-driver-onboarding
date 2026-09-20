package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.User;
import com.kruskal1024.takeoff.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            User user = userService.createUser(request.getPhone());
            return ResponseEntity.ok(user);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(409)
                    .body(e.getMessage());
        }
    }

    public static class RegisterRequest {

        private String phone;

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}