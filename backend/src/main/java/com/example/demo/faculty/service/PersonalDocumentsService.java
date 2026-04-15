package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.FacultyEntityChecks;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.PersonalDocuments;
import com.example.demo.faculty.repository.PersonalDocumentsRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonalDocumentsService {

    private final PersonalDocumentsRepository personalDocumentsRepository;

    public boolean documentsExist(int documentId) {
        Optional<PersonalDocuments> documents = personalDocumentsRepository.findById(documentId);
        return documents.isPresent();
    }

    public boolean addDocuments(PersonalDocuments documents) {
        if (!documentsExist(documents.getDocumentId())) {
            personalDocumentsRepository.save(documents);
            return true;
        }
        return false;
    }

    public PersonalDocuments getDocumentsByFaculty(Faculty faculty) {
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return null;
        }
        return personalDocumentsRepository.findByFaculty(faculty);
    }

    public boolean updateDocuments(PersonalDocuments documents) {
        if (documentsExist(documents.getDocumentId())) {
            personalDocumentsRepository.save(documents);
            return true;
        }
        return false;
    }

    public boolean deleteDocuments(int documentId) {
        if (documentsExist(documentId)) {
            personalDocumentsRepository.deleteById(documentId);
            return true;
        }
        return false;
    }
}