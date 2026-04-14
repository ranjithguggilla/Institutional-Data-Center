package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.RecentEducation;
import com.example.demo.faculty.repository.RecentEducationRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecentEducationService {

    private final RecentEducationRepository recentEducationRepository;

    public boolean recentEducationExists(int userId) {
        Optional<RecentEducation> recentEducation = recentEducationRepository.findById(userId);
        return recentEducation.isPresent();
    }

    public boolean addRecentEducation(RecentEducation recentEducation) {
        if (!recentEducationExists(recentEducation.getUserId())) {
            recentEducationRepository.save(recentEducation);
            return true;
        }
        return false;
    }

    public List<RecentEducation> getAllRecentEducations() {
        return recentEducationRepository.findAll();
    }

    public boolean deleteRecentEducation(int userId) {
        if (recentEducationExists(userId)) {
            recentEducationRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public RecentEducation getRecentEducationById(int userId) {
        Optional<RecentEducation> recentEducation = recentEducationRepository.findById(userId);
        if(recentEducation.isPresent()) {
        	return recentEducation.get();
        }
        return new RecentEducation();
    }

    public boolean updateRecentEducation(RecentEducation recentEducation) {
        if (recentEducationExists(recentEducation.getUserId())) {
            recentEducationRepository.save(recentEducation);
            return true;
        }
        return false;
    }
}