package com.kruskal1024.takeoff.repository;

import com.kruskal1024.takeoff.entity.VehicleDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleDocumentRepository extends JpaRepository<VehicleDocument, Long> {

    List<VehicleDocument> findByVehicleIdOrderByCreatedAtAsc(Long vehicleId);

}