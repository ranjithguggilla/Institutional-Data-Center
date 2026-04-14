package com.example.demo.student.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.student.entity.Certification;
import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.CertificationRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public boolean certificationExists(int certificationId) {
        Optional<Certification> certification = certificationRepository.findById(certificationId);
        return certification.isPresent();
    }

    public boolean addCertification(Certification certification) {
        if (!certificationExists(certification.getCertificationId())) {
            certificationRepository.save(certification);
            return true;
        }
        return false;
    }

    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    public boolean deleteCertification(int certificationId) {
        if (certificationExists(certificationId)) {
            certificationRepository.deleteById(certificationId);
            return true;
        }
        return false;
    }

    public Certification getCertificationById(int certificationId) {
        Optional<Certification> certification = certificationRepository.findById(certificationId);
        if(certification.isPresent()) {
        	certification.get();
        }
        return new Certification();
    }

    public boolean updateCertification(Certification certification) {
        if (certificationExists(certification.getCertificationId())) {
            certificationRepository.save(certification);
            return true;
        }
        return false;
    }
    
    public List<Certification> getCertificationByStudent(Student student){
    	return certificationRepository.findByStudent(student);
    }
    
    public List<String> getAllUniqueCertificationsTechnical(){
    	return certificationRepository.findUniqueTechnicalVerifications();
    }
    
    public List<String> getAllUniqueCertificationsNonTechnical(){
    	return certificationRepository.findUniqueNonTechnicalVerifications();
    }
    
    public List<String> getAllUniqueCertificationStudentIds(){
    	return certificationRepository.findAllUniqueCertifcationStudentIds();
    }
    
    public List<String> getAllUniqueCertificationByStudentId(Student student){
    	return certificationRepository.findAllUniqueVerificationsByStudent(student);
    }
    
}