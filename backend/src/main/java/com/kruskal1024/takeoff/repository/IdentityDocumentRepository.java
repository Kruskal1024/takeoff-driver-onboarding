package com.kruskal1024.takeoff.repository;

import com.kruskal1024.takeoff.entity.IdentityDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IdentityDocumentRepository extends JpaRepository<IdentityDocument, Long> {

    List<IdentityDocument> findByApplicationIdOrderByCreatedAtAsc(Long applicationId);
}