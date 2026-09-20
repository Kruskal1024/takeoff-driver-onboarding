package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.User;
import com.kruskal1024.takeoff.repository.DriverApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DriverApplicationService {

    private final DriverApplicationRepository driverApplicationRepository;

    public DriverApplicationService(DriverApplicationRepository driverApplicationRepository) {
        this.driverApplicationRepository = driverApplicationRepository;
    }

    public DriverApplication createApplication(User user) {
        DriverApplication application = new DriverApplication();
        application.setUser(user);
        application.setStatus("DRAFT");
        return driverApplicationRepository.save(application);
    }

    public DriverApplication updatePersonalInfo(
            DriverApplication application,
            String firstName,
            String lastName,
            LocalDate dateOfBirth,
            String email,
            String address
    ) {
        application.setFirstName(firstName);
        application.setLastName(lastName);
        application.setDateOfBirth(dateOfBirth);
        application.setEmail(email);
        application.setAddress(address);
        return driverApplicationRepository.save(application);
    }

}