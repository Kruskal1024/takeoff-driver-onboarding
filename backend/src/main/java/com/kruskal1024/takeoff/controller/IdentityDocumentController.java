package com.kruskal1024.takeoff.controller;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.IdentityDocument;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import com.kruskal1024.takeoff.service.IdentityDocumentService;
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
public class IdentityDocumentController {

    private final DriverApplicationRepository driverApplicationRepository;
    private final IdentityDocumentService identityDocumentService;

    public IdentityDocumentController(
            DriverApplicationRepository driverApplicationRepository,
            IdentityDocumentService identityDocumentService
    ) {
        this.driverApplicationRepository = driverApplicationRepository;
        this.identityDocumentService = identityDocumentService;
    }

    @PostMapping("/{applicationId}/identity-document")
    public ResponseEntity<?> createIdentityDocument(
            @PathVariable Long applicationId,
            @RequestBody IdentityDocumentRequest request
    ) {
        Optional<DriverApplication> application = driverApplicationRepository.findById(applicationId);

        if (application.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Application not found"));
        }

        IdentityDocument identityDocument = identityDocumentService.createIdentityDocument(
                application.get(),
                request.getDocumentType(),
                request.getDocumentNumber(),
                request.getDocumentFileUrl()
        );

        return ResponseEntity.ok(new IdentityDocumentResponse(
                identityDocument.getId(),
                applicationId,
                identityDocument.getDocumentType(),
                identityDocument.getDocumentNumber()
        ));
    }

    public static class IdentityDocumentRequest {

        private String documentType;
        private String documentNumber;
        private String documentFileUrl;

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public String getDocumentNumber() {
            return documentNumber;
        }

        public void setDocumentNumber(String documentNumber) {
            this.documentNumber = documentNumber;
        }

        public String getDocumentFileUrl() {
            return documentFileUrl;
        }

        public void setDocumentFileUrl(String documentFileUrl) {
            this.documentFileUrl = documentFileUrl;
        }

    }

    public static class IdentityDocumentResponse {

        private Long id;
        private Long applicationId;
        private String documentType;
        private String documentNumber;

        public IdentityDocumentResponse() {
        }

        public IdentityDocumentResponse(Long id, Long applicationId, String documentType, String documentNumber) {
            this.id = id;
            this.applicationId = applicationId;
            this.documentType = documentType;
            this.documentNumber = documentNumber;
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

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public String getDocumentNumber() {
            return documentNumber;
        }

        public void setDocumentNumber(String documentNumber) {
            this.documentNumber = documentNumber;
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