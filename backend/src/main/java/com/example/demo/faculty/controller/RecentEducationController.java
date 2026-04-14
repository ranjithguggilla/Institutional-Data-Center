package com.example.demo.faculty.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.faculty.entity.RecentEducation;
import com.example.demo.faculty.service.RecentEducationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("recent-education")
@RequiredArgsConstructor
public class RecentEducationController {

    private final RecentEducationService recentEducationService;

    @PostMapping("add-recent-education")
    public boolean addRecentEducation(@RequestBody RecentEducation recentEducation) {
        return recentEducationService.addRecentEducation(recentEducation);
    }

    @GetMapping("get-recent-education/{userId}")
    public RecentEducation getRecentEducationByUserId(@PathVariable("userId") int userId) {
        return recentEducationService.getRecentEducationById(userId);
    }

    @GetMapping("get-all-recent-educations")
    public List<RecentEducation> getAllRecentEducations() {
        return recentEducationService.getAllRecentEducations();
    }

    @PutMapping("update-recent-education/{userId}")
    public boolean updateRecentEducation(@PathVariable("userId") int userId, @RequestBody RecentEducation recentEducation) {
        return recentEducationService.updateRecentEducation(recentEducation);
    }

    @DeleteMapping("delete-recent-education/{userId}")
    public boolean deleteRecentEducation(@PathVariable("userId") int userId) {
        return recentEducationService.deleteRecentEducation(userId);
    }
}
