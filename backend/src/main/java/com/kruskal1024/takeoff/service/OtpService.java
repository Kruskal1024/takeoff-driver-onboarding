package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.OtpCode;
import com.kruskal1024.takeoff.repository.OtpCodeRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(OtpCodeRepository otpCodeRepository) {
        this.otpCodeRepository = otpCodeRepository;
    }

    public OtpCode createOtp(String phone, String otpCodeHash) {
        OtpCode otpCode = new OtpCode();
        otpCode.setPhone(phone);
        otpCode.setOtpCodeHash(otpCodeHash);
        otpCode.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpCode.setVerified(false);

        return otpCodeRepository.save(otpCode);
    }

    public String generateOtp(String phone) {
        String plainOtp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        String otpCodeHash = BCrypt.hashpw(
                plainOtp,
                BCrypt.gensalt()
        );

        createOtp(phone, otpCodeHash);

        return plainOtp;
    }

    public boolean verifyOtp(String phone, String submittedOtp) {

        Optional<OtpCode> optionalOtp =
                otpCodeRepository.findTopByPhoneOrderByCreatedAtDesc(phone);

        if (optionalOtp.isEmpty()) {
            return false;
        }

        OtpCode otpCode = optionalOtp.get();

        if (otpCode.isVerified()) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpCode.getExpiresAt())) {
            return false;
        }

        boolean matches = BCrypt.checkpw(
                submittedOtp,
                otpCode.getOtpCodeHash()
        );

        if (!matches) {
            return false;
        }

        otpCode.setVerified(true);
        otpCodeRepository.save(otpCode);

        return true;
    }

}