package com.kruskal1024.takeoff.repository;

import com.kruskal1024.takeoff.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findTopByPhoneOrderByCreatedAtDesc(String phone);

}