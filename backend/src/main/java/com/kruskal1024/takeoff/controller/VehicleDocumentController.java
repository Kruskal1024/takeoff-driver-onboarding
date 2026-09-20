package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.Vehicle;
import com.kruskal1024.takeoff.entity.VehicleDocument;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import com.kruskal1024.takeoff.repository.VehicleRepository;
import com.kruskal1024.takeoff.service.VehicleDocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class VehicleDocumentController {

    private final DriverApplicationRepository driverApplicationRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentService vehicleDocumentService;

    public VehicleDocumentController(
            DriverApplicationRepository driverApplicationRepository,
            VehicleRepository vehicleRepository,
            VehicleDocumentService vehicleDocumentService
    ) {
        this.driverApplicationRepository = driverApplicationRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleDocumentService = vehicleDocumentService;
    }

    @PostMapping("/{applicationId}/vehicle-documents")
    public ResponseEntity<?> createVehicleDocument(
            @PathVariable Long applicationId,
            @RequestBody VehicleDocumentRequest request
    ) {
        Optional<DriverApplication> application =
                driverApplicationRepository.findById(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application not found"));
        }

        Optional<Vehicle> vehicle =
                vehicleRepository.findTopByApplicationIdOrderByCreatedAtDesc(applicationId);

        if (vehicle.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Vehicle information not found"));
        }

        VehicleDocument document = vehicleDocumentService.createVehicleDocument(
                vehicle.get(),
                request.getDocumentType(),
                request.getDocumentFileUrl()
        );

        return ResponseEntity.ok(
                new VehicleDocumentResponse(
                        document.getId(),
                        applicationId,
                        vehicle.get().getId(),
                        document.getDocumentType(),
                        document.getDocumentFileUrl()
                )
        );
    }

    public static class VehicleDocumentRequest {
        private String documentType;
        private String documentFileUrl;

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public String getDocumentFileUrl() {
            return documentFileUrl;
        }

        public void setDocumentFileUrl(String documentFileUrl) {
            this.documentFileUrl = documentFileUrl;
        }
    }

    public static class VehicleDocumentResponse {
        private Long id;
        private Long applicationId;
        private Long vehicleId;
        private String documentType;
        private String documentFileUrl;

        public VehicleDocumentResponse(
                Long id,
                Long applicationId,
                Long vehicleId,
                String documentType,
                String documentFileUrl
        ) {
            this.id = id;
            this.applicationId = applicationId;
            this.vehicleId = vehicleId;
            this.documentType = documentType;
            this.documentFileUrl = documentFileUrl;
        }

        public Long getId() {
            return id;
        }

        public Long getApplicationId() {
            return applicationId;
        }

        public Long getVehicleId() {
            return vehicleId;
        }

        public String getDocumentType() {
            return documentType;
        }

        public String getDocumentFileUrl() {
            return documentFileUrl;
        }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}