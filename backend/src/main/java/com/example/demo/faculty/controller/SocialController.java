package com.example.demo.faculty.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.faculty.entity.Social;
import com.example.demo.faculty.service.FacultyService;
import com.example.demo.faculty.service.SocialService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;
    private final FacultyService facultyService;

    @PostMapping("add-social")
    public boolean addSocial(@RequestBody Social social, Principal principal) {
        social.setFaculty(facultyService.getFacultyById(principal.getName()));
        return socialService.addSocial(social);
    }

    @GetMapping("get-social/{socialId}")
    public Social getSocialById(@PathVariable("socialId") int socialId) {
        return socialService.getSocialById(socialId);
    }

    @GetMapping("get-all-socials")
    public List<Social> getAllSocials() {
        return socialService.getAllSocials();
    }

    @GetMapping("get-all-socials-by-id")
    public List<Social> getSocialsById(Principal principal) {
        return socialService.getSocialByFaculty(facultyService.getFacultyById(principal.getName()));
    }

    @GetMapping("get-all-socials-by-id/{facultyId}")
    public List<Social> getSocialsById(@PathVariable("facultyId") String facultyId) {
        return socialService.getSocialByFaculty(facultyService.getFacultyById(facultyId));
    }

    @PutMapping("update-social/{socialId}")
    public boolean updateSocial(@PathVariable("socialId") int socialId, @RequestBody Social social) {
        return socialService.updateSocial(social);
    }

    @DeleteMapping("delete-social/{socialId}")
    public boolean deleteSocial(@PathVariable("socialId") int socialId) {
        return socialService.deleteSocial(socialId);
    }
}
