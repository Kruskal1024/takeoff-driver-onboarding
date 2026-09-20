package com.kruskal1024.takeoff.repository;

import com.kruskal1024.takeoff.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findTopByApplicationIdOrderByCreatedAtDesc(Long applicationId);

}