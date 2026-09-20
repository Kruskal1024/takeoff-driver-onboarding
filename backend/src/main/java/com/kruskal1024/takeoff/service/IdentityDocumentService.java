package com.kruskal1024.takeoff.service;

import com.kruskal1024.takeoff.entity.DriverApplication;
import com.kruskal1024.takeoff.entity.IdentityDocument;
import com.kruskal1024.takeoff.repository.IdentityDocumentRepository;
import org.springframework.stereotype.Service;

@Service
public class IdentityDocumentService {

    private final IdentityDocumentRepository identityDocumentRepository;

    public IdentityDocumentService(IdentityDocumentRepository identityDocumentRepository) {
        this.identityDocumentRepository = identityDocumentRepository;
    }

    public IdentityDocument createIdentityDocument(
            DriverApplication application,
            String documentType,
            String documentNumber,
            String documentFileUrl
    ) {
        IdentityDocument identityDocument = new IdentityDocument();
        identityDocument.setApplication(application);
        identityDocument.setDocumentType(documentType);
        identityDocument.setDocumentNumber(documentNumber);
        identityDocument.setDocumentFileUrl(documentFileUrl);
        return identityDocumentRepository.save(identityDocument);
    }

}