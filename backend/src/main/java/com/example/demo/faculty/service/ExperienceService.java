package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.Experience;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.repository.ExperienceRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public boolean experienceExists(int experienceId) {
        Optional<Experience> experience = experienceRepository.findById(experienceId);
        return experience.isPresent();
    }

    public boolean addExperience(Experience experience) {
        if (!experienceExists(experience.getExperienceId())) {
            experienceRepository.save(experience);
            return true;
        }
        return false;
    }

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll();
    }

    public boolean deleteExperience(int experienceId) {
        if (experienceExists(experienceId)) {
            experienceRepository.deleteById(experienceId);
            return true;
        }
        return false;
    }

    public Experience getExperienceById(int experienceId) {
        Optional<Experience> experience = experienceRepository.findById(experienceId);
        if(experience.isPresent()) {
        	return experience.get();
        }
        return new Experience();
    }

    public boolean updateExperience(Experience experience) {
        if (experienceExists(experience.getExperienceId())) {
            experienceRepository.save(experience);
            return true;
        }
        return false;
    }
    
    public List<Experience> getByFacultyObject(Faculty faculty){
    	return experienceRepository.findByFaculty(faculty);
    }
    
    public List<String> getAllUniqueExperiences(){
    	return experienceRepository.findAllUniqueExperiences();
    }

    public List<String> getAllUniqueExperienceFacultyIds(){
    	return experienceRepository.findAllUniqueExperienceFacultyIds();
    }
    
    public List<String> getUniqueExperienceCompanyByFaculty(Faculty faculty){
    	return experienceRepository.findUniqueExperienceCompanyByFaculty(faculty);
    }
    
}