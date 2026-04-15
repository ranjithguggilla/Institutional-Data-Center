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

import com.example.demo.admin.GovernanceService;
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
    private final GovernanceService governanceService;

    @PostMapping("add-social")
    public boolean addSocial(@RequestBody Social social, Principal principal) {
        social.setFaculty(facultyService.getFacultyById(principal.getName()));
        boolean created = socialService.addSocial(social);
        if (created) {
            governanceService.recordChange(principal.getName(), "FACULTY_SOCIAL", principal.getName(), "CREATE",
                    "Faculty social links created");
        }
        return created;
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
    public boolean updateSocial(@PathVariable("socialId") int socialId, @RequestBody Social patch, Principal principal) {
        Social existing = socialService.getSocialById(socialId);
        if (existing.getSocialId() == 0) {
            return false;
        }
        mergeSocialFields(existing, patch);
        boolean updated = socialService.updateSocial(existing);
        if (updated) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "FACULTY_SOCIAL",
                    String.valueOf(socialId), "UPDATE", "Faculty social links updated");
        }
        return updated;
    }

    private static void mergeSocialFields(Social target, Social patch) {
        if (patch.getLinkedin() != null) {
            target.setLinkedin(patch.getLinkedin());
        }
        if (patch.getGithub() != null) {
            target.setGithub(patch.getGithub());
        }
        if (patch.getGoogleScholar() != null) {
            target.setGoogleScholar(patch.getGoogleScholar());
        }
        if (patch.getOrcid() != null) {
            target.setOrcid(patch.getOrcid());
        }
        if (patch.getResearchGate() != null) {
            target.setResearchGate(patch.getResearchGate());
        }
        if (patch.getPortfolioUrl() != null) {
            target.setPortfolioUrl(patch.getPortfolioUrl());
        }
    }

    @DeleteMapping("delete-social/{socialId}")
    public boolean deleteSocial(@PathVariable("socialId") int socialId, Principal principal) {
        boolean deleted = socialService.deleteSocial(socialId);
        if (deleted) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "FACULTY_SOCIAL",
                    String.valueOf(socialId), "DELETE", "Faculty social links removed");
        }
        return deleted;
    }
}
