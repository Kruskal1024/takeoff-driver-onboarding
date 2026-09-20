package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.Vehicle;
import com.kruskal1024.takeoff.entity.VehicleDocument;
import com.kruskal1024.takeoff.repository.VehicleDocumentRepository;
import org.springframework.stereotype.Service;

@Service
public class VehicleDocumentService {

    private final VehicleDocumentRepository vehicleDocumentRepository;

    public VehicleDocumentService(VehicleDocumentRepository vehicleDocumentRepository) {
        this.vehicleDocumentRepository = vehicleDocumentRepository;
    }

    public VehicleDocument createVehicleDocument(
            Vehicle vehicle,
            String documentType,
            String documentFileUrl
    ) {
        VehicleDocument vehicleDocument = new VehicleDocument();
        vehicleDocument.setVehicle(vehicle);
        vehicleDocument.setDocumentType(documentType);
        vehicleDocument.setDocumentFileUrl(documentFileUrl);
        return vehicleDocumentRepository.save(vehicleDocument);
    }

}