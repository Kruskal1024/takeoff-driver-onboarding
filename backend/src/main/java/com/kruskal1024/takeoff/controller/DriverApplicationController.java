package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.User;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import com.kruskal1024.takeoff.repository.UserRepository;
import com.kruskal1024.takeoff.service.DriverApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class DriverApplicationController {

    private final UserRepository userRepository;
    private final DriverApplicationRepository driverApplicationRepository;
    private final DriverApplicationService driverApplicationService;

    public DriverApplicationController(
            UserRepository userRepository,
            DriverApplicationRepository driverApplicationRepository,
            DriverApplicationService driverApplicationService
    ) {
        this.userRepository = userRepository;
        this.driverApplicationRepository = driverApplicationRepository;
        this.driverApplicationService = driverApplicationService;
    }

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody CreateApplicationRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());

        if (user.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("User not found"));
        }

        DriverApplication application = driverApplicationService.createApplication(user.get());

        return ResponseEntity.ok(new CreateApplicationResponse(
                application.getId(),
                application.getUser().getId(),
                application.getStatus()
        ));
    }

    @PutMapping("/{applicationId}/personal-info")
    public ResponseEntity<?> updatePersonalInfo(
            @PathVariable Long applicationId,
            @RequestBody PersonalInfoRequest request
    ) {
        Optional<DriverApplication> application = driverApplicationRepository.findById(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application not found"));
        }

        DriverApplication updated = driverApplicationService.updatePersonalInfo(
                application.get(),
                request.getFirstName(),
                request.getLastName(),
                request.getDateOfBirth(),
                request.getEmail(),
                request.getAddress()
        );

        return ResponseEntity.ok(new PersonalInfoResponse(
                updated.getId(),
                updated.getStatus(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getEmail()
        ));
    }

    public static class CreateApplicationRequest {

        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

    }

    public static class CreateApplicationResponse {

        private Long id;
        private Long userId;
        private String status;

        public CreateApplicationResponse() {
        }

        public CreateApplicationResponse(Long id, Long userId, String status) {
            this.id = id;
            this.userId = userId;
            this.status = status;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

    }

    public static class ErrorResponse {

        private String message;

        public ErrorResponse() {
        }

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

    }

    public static class PersonalInfoRequest {

        private String firstName;
        private String lastName;
        private LocalDate dateOfBirth;
        private String email;
        private String address;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public LocalDate getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

    }

    public static class PersonalInfoResponse {

        private Long id;
        private String status;
        private String firstName;
        private String lastName;
        private String email;

        public PersonalInfoResponse() {
        }

        public PersonalInfoResponse(Long id, String status, String firstName, String lastName, String email) {
            this.id = id;
            this.status = status;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

    }

}