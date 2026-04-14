package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.repository.FacultyRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public boolean facultyExists(String facultyId) {
        Optional<Faculty> faculty = facultyRepository.findById(facultyId);
        return faculty.isPresent();
    }

    public boolean addFaculty(Faculty faculty) {
        if (!facultyExists(faculty.getFacultyId())) {
            facultyRepository.save(faculty);
            return true;
        }
        return false;
    }

    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }

    public boolean deleteFaculty(String facultyId) {
        if (facultyExists(facultyId)) {
            facultyRepository.deleteById(facultyId);
            return true;
        }
        return false;
    }

    public Faculty getFacultyById(String facultyId) {
        Optional<Faculty> faculty = facultyRepository.findById(facultyId);
        if(faculty.isPresent()) {
        	return faculty.get();
        }
        return new Faculty();
    }

    public boolean updateFaculty(Faculty faculty) {
        if (facultyExists(faculty.getFacultyId())) {
            facultyRepository.save(faculty);
            return true;
        }
        return false;
    }
    
    public List<String> getAllUniqueDesignations(){
		return facultyRepository.findAllUniqueDesignations();
	}
	
	public List<String> getAllUniqueDepartments(){
		return facultyRepository.findAllUniqueDepartments();
	}
    
}