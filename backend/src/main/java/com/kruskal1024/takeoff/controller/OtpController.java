package com.kruskal1024.takeoff.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kruskal1024.takeoff.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/otp/generate")
    public ResponseEntity<GenerateOtpResponse> generateOtp(@RequestBody GenerateOtpRequest request) {
        String otp = otpService.generateOtp(request.getPhone());
        return ResponseEntity.ok(new GenerateOtpResponse(otp));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        boolean verified = otpService.verifyOtp(request.getPhone(), request.getOtp());

        if (verified) {
            return ResponseEntity.ok(new VerifyOtpResponse(true, null));
        }

        return ResponseEntity.badRequest().body(new VerifyOtpResponse(false, "Invalid or expired OTP"));
    }

    public static class GenerateOtpRequest {

        private String phone;

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

    }

    public static class GenerateOtpResponse {

        private String otp;

        public GenerateOtpResponse() {
        }

        public GenerateOtpResponse(String otp) {
            this.otp = otp;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

    }

    public static class VerifyOtpRequest {

        private String phone;
        private String otp;

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class VerifyOtpResponse {

        private boolean verified;
        private String message;

        public VerifyOtpResponse() {
        }

        public VerifyOtpResponse(boolean verified, String message) {
            this.verified = verified;
            this.message = message;
        }

        public boolean isVerified() {
            return verified;
        }

        public void setVerified(boolean verified) {
            this.verified = verified;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

    }

}