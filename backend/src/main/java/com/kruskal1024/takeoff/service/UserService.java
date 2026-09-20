package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.User;
import com.kruskal1024.takeoff.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String phone) {

        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Phone number is already registered");
        }

        User user = new User();
        user.setPhone(phone);
        user.setRole("DRIVER");

        return userRepository.save(user);
    }
}