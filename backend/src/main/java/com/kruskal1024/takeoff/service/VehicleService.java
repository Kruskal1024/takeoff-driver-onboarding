package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.Vehicle;
import com.kruskal1024.takeoff.repository.VehicleRepository;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle createVehicle(
            DriverApplication application,
            String vehicleType,
            String make,
            String model,
            Integer year,
            String registrationNumber,
            String color
    ) {
        Vehicle vehicle = new Vehicle();
        vehicle.setApplication(application);
        vehicle.setVehicleType(vehicleType);
        vehicle.setMake(make);
        vehicle.setModel(model);
        vehicle.setYear(year);
        vehicle.setRegistrationNumber(registrationNumber);
        vehicle.setColor(color);
        return vehicleRepository.save(vehicle);
    }

}