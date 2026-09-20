package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.Vehicle;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import com.kruskal1024.takeoff.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class VehicleController {

    private final DriverApplicationRepository driverApplicationRepository;
    private final VehicleService vehicleService;

    public VehicleController(
            DriverApplicationRepository driverApplicationRepository,
            VehicleService vehicleService
    ) {
        this.driverApplicationRepository = driverApplicationRepository;
        this.vehicleService = vehicleService;
    }

    @PostMapping("/{applicationId}/vehicle")
    public ResponseEntity<?> createVehicle(
            @PathVariable Long applicationId,
            @RequestBody VehicleRequest request
    ) {
        Optional<DriverApplication> application = driverApplicationRepository.findById(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application not found"));
        }

        Vehicle vehicle = vehicleService.createVehicle(
                application.get(),
                request.getVehicleType(),
                request.getMake(),
                request.getModel(),
                request.getYear(),
                request.getRegistrationNumber(),
                request.getColor()
        );

        return ResponseEntity.ok(new VehicleResponse(
                vehicle.getId(),
                applicationId,
                vehicle.getVehicleType(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getRegistrationNumber(),
                vehicle.getColor()
        ));
    }

    public static class VehicleRequest {

        private String vehicleType;
        private String make;
        private String model;
        private Integer year;
        private String registrationNumber;
        private String color;

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
        }

        public String getMake() {
            return make;
        }

        public void setMake(String make) {
            this.make = make;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public String getRegistrationNumber() {
            return registrationNumber;
        }

        public void setRegistrationNumber(String registrationNumber) {
            this.registrationNumber = registrationNumber;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

    }

    public static class VehicleResponse {

        private Long id;
        private Long applicationId;
        private String vehicleType;
        private String make;
        private String model;
        private Integer year;
        private String registrationNumber;
        private String color;

        public VehicleResponse() {
        }

        public VehicleResponse(
                Long id,
                Long applicationId,
                String vehicleType,
                String make,
                String model,
                Integer year,
                String registrationNumber,
                String color
        ) {
            this.id = id;
            this.applicationId = applicationId;
            this.vehicleType = vehicleType;
            this.make = make;
            this.model = model;
            this.year = year;
            this.registrationNumber = registrationNumber;
            this.color = color;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getApplicationId() {
            return applicationId;
        }

        public void setApplicationId(Long applicationId) {
            this.applicationId = applicationId;
        }

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
        }

        public String getMake() {
            return make;
        }

        public void setMake(String make) {
            this.make = make;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public String getRegistrationNumber() {
            return registrationNumber;
        }

        public void setRegistrationNumber(String registrationNumber) {
            this.registrationNumber = registrationNumber;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
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

}