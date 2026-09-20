package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.IdentityDocument;
import com.kruskal1024.takeoff.entity.Vehicle;
import com.kruskal1024.takeoff.entity.VehicleDocument;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import com.kruskal1024.takeoff.repository.IdentityDocumentRepository;
import com.kruskal1024.takeoff.repository.VehicleDocumentRepository;
import com.kruskal1024.takeoff.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationReviewController {

    private final DriverApplicationRepository applicationRepository;
    private final IdentityDocumentRepository identityDocumentRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentRepository vehicleDocumentRepository;

    public ApplicationReviewController(
            DriverApplicationRepository applicationRepository,
            IdentityDocumentRepository identityDocumentRepository,
            VehicleRepository vehicleRepository,
            VehicleDocumentRepository vehicleDocumentRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.identityDocumentRepository = identityDocumentRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleDocumentRepository = vehicleDocumentRepository;
    }

    @GetMapping("/{applicationId}/review")
    public ResponseEntity<?> getReview(@PathVariable Long applicationId) {

        Optional<DriverApplication> applicationOptional =
                applicationRepository.findById(applicationId);

        if (applicationOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Application not found"));
        }

        DriverApplication application = applicationOptional.get();

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("applicationId", application.getId());
        response.put("status", application.getStatus());

        Map<String, Object> personal = new LinkedHashMap<>();
        personal.put("firstName", application.getFirstName());
        personal.put("lastName", application.getLastName());
        personal.put("dateOfBirth", application.getDateOfBirth());
        personal.put("email", application.getEmail());
        personal.put("address", application.getAddress());

        response.put("personal", personal);

        List<Map<String, Object>> identityDocuments = new ArrayList<>();

        List<IdentityDocument> identityDocumentList =
                identityDocumentRepository
                        .findByApplicationIdOrderByCreatedAtAsc(applicationId);

        for (IdentityDocument document : identityDocumentList) {
            Map<String, Object> item = new LinkedHashMap<>();

            item.put("id", document.getId());
            item.put("documentType", document.getDocumentType());
            item.put("documentNumber", document.getDocumentNumber());
            item.put("documentFileUrl", document.getDocumentFileUrl());

            identityDocuments.add(item);
        }

        response.put("identityDocuments", identityDocuments);

        Optional<Vehicle> vehicleOptional =
                vehicleRepository.findTopByApplicationIdOrderByCreatedAtDesc(applicationId);

        if (vehicleOptional.isPresent()) {

            Vehicle vehicle = vehicleOptional.get();

            Map<String, Object> vehicleData = new LinkedHashMap<>();

            vehicleData.put("id", vehicle.getId());
            vehicleData.put("vehicleType", vehicle.getVehicleType());
            vehicleData.put("make", vehicle.getMake());
            vehicleData.put("model", vehicle.getModel());
            vehicleData.put("year", vehicle.getYear());
            vehicleData.put(
                    "registrationNumber",
                    vehicle.getRegistrationNumber()
            );
            vehicleData.put("color", vehicle.getColor());

            response.put("vehicle", vehicleData);

            List<Map<String, Object>> vehicleDocuments = new ArrayList<>();

            List<VehicleDocument> vehicleDocumentList =
                    vehicleDocumentRepository
                            .findByVehicleIdOrderByCreatedAtAsc(vehicle.getId());

            for (VehicleDocument document : vehicleDocumentList) {

                Map<String, Object> item = new LinkedHashMap<>();

                item.put("id", document.getId());
                item.put("documentType", document.getDocumentType());
                item.put("documentFileUrl", document.getDocumentFileUrl());

                vehicleDocuments.add(item);
            }

            response.put("vehicleDocuments", vehicleDocuments);

        } else {

            response.put("vehicle", null);
            response.put("vehicleDocuments", new ArrayList<>());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{applicationId}/submit")
    public ResponseEntity<?> submitApplication(
            @PathVariable Long applicationId
    ) {

        Optional<DriverApplication> applicationOptional =
                applicationRepository.findById(applicationId);

        if (applicationOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Application not found"));
        }

        DriverApplication application = applicationOptional.get();

        application.setStatus("SUBMITTED");

        DriverApplication savedApplication =
                applicationRepository.save(application);

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("applicationId", savedApplication.getId());
        response.put("status", savedApplication.getStatus());
        response.put("message", "Application submitted successfully");

        return ResponseEntity.ok(response);
    }
}