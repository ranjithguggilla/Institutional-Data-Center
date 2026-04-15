package com.example.demo.faculty.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.example.demo.faculty.FacultyEntityChecks;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.repository.FacultyCertificationRepository;
import com.example.demo.faculty.entity.FacultyCertification;
import com.example.demo.faculty.entity.Faculty;

@Service
@RequiredArgsConstructor
public class FacultyCertificationService {

	private final FacultyCertificationRepository certificationRepository;
	
	public boolean certificationExists(int certificationId) {
        Optional<FacultyCertification> certification = certificationRepository.findById(certificationId);
        return certification.isPresent();
    }

    public boolean addCertification(FacultyCertification certification) {
        if (!certificationExists(certification.getCertificationId())) {
            certificationRepository.save(certification);
            return true;
        }
        return false;
    }

    public List<FacultyCertification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public boolean deleteCertification(int certificationId) {
        if (certificationExists(certificationId)) {
            certificationRepository.deleteById(certificationId);
            return true;
        }
        return false;
    }

    public FacultyCertification getCertificationById(int certificationId) {
        Optional<FacultyCertification> certification = certificationRepository.findById(certificationId);
        if(certification.isPresent()) {
        	certification.get();
        }
        return new FacultyCertification();
    }

    public boolean updateCertification(FacultyCertification certification) {
        if (certificationExists(certification.getCertificationId())) {
            certificationRepository.save(certification);
            return true;
        }
        return false;
    }
	
    public List<FacultyCertification> getCertificationByFaculty(Faculty faculty){
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
    	return certificationRepository.findByFaculty(faculty);
    }
    
    public List<String> getAllUniqueCertificationFacultyIds(){
    	return certificationRepository.findAllUniqueFacultyCertificationFacultyIds();
    }
    
    public List<String> getUniqueCertificationTypeByFaculty(Faculty faculty){
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
    	return certificationRepository.findUniqueFacultyCertificationVerificationByFaculty(faculty);
    }
    
}
