package com.kruskal1024.takeoff.repository;

import com.kruskal1024.takeoff.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByPhone(String phone);

}