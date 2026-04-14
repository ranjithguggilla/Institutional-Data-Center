package com.example.demo.student.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.student.entity.Internship;
import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.InternshipRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InternshipService {

    private final InternshipRepository internshipRepository;

    public boolean internshipExists(int internshipId) {
        Optional<Internship> internship = internshipRepository.findById(internshipId);
        return internship.isPresent();
    }

    public boolean addInternship(Internship internship) {
        if (!internshipExists(internship.getInternshipId())) {
            internshipRepository.save(internship);
            return true;
        }
        return false;
    }

    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    public boolean deleteInternship(int internshipId) {
        if (internshipExists(internshipId)) {
            internshipRepository.deleteById(internshipId);
            return true;
        }
        return false;
    }

    public Internship getInternshipById(int internshipId) {
        Optional<Internship> internship = internshipRepository.findById(internshipId);
        if(internship.isPresent()) {
        	return internship.get();
        }
        return new Internship();
    }

    public boolean updateInternship(Internship internship) {
        if (internshipExists(internship.getInternshipId())) {
            internshipRepository.save(internship);
            return true;
        }
        return false;
    }
    
    public List<Internship> getInternshipByStudent(Student student){
    	return internshipRepository.findByStudent(student);
    }
    
    public List<String> getAllUniqueStudentIdsByInternship(){
    	return internshipRepository.findAllUniqueStudentIds();
    }
    
    public List<String> getUniqueInternshipsByStudent(Student student) {
    	return internshipRepository.findUniqueInternshipTypesByStudent(student);
    }
}