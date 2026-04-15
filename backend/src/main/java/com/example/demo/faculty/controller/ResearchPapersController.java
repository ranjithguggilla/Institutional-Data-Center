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
import com.example.demo.faculty.entity.ResearchPapers;
import com.example.demo.faculty.service.FacultyService;
import com.example.demo.faculty.service.ResearchPapersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("research-papers")
@RequiredArgsConstructor
public class ResearchPapersController {

    private final ResearchPapersService researchPapersService;
    private final FacultyService facultyService;
    private final GovernanceService governanceService;

    @PostMapping("add-paper")
    public boolean addPaper(Principal principal, @RequestBody ResearchPapers paper) {
        paper.setFaculty(facultyService.getFacultyById(principal.getName()));
        boolean created = researchPapersService.addPaper(paper);
        if (created) {
            governanceService.recordChange(principal.getName(), "RESEARCH_PAPER", principal.getName(), "CREATE",
                    "Research paper added: " + paper.getPublishedTitle());
        }
        return created;
    }

    @GetMapping("get-paper/{paperId}")
    public ResearchPapers getPaperById(@PathVariable("paperId") Integer paperId) {
        return researchPapersService.getPaperById(paperId);
    }

    @GetMapping("get-all-papers")
    public List<ResearchPapers> getAllPapers() {
        return researchPapersService.getAllPapers();
    }

    @GetMapping("get-all-papers-by-id")
    public List<ResearchPapers> getAllPapersById(Principal principal) {
        return researchPapersService.getByFacultyObject(facultyService.getFacultyById(principal.getName()));
    }

    @GetMapping("get-all-papers-by-id/{facultyId}")
    public List<ResearchPapers> getAllPapersById(@PathVariable("facultyId") String facultyId) {
        return researchPapersService.getByFacultyObject(facultyService.getFacultyById(facultyId));
    }

    @PutMapping("update-paper/{paperId}")
    public boolean updatePaper(@PathVariable("paperId") Integer paperId, @RequestBody ResearchPapers paper, Principal principal) {
        boolean updated = researchPapersService.updatePaper(paper);
        if (updated) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "RESEARCH_PAPER",
                    String.valueOf(paperId), "UPDATE", "Research paper updated: " + paper.getPublishedTitle());
        }
        return updated;
    }

    @DeleteMapping("delete-paper/{paperId}")
    public boolean deletePaper(@PathVariable("paperId") Integer paperId, Principal principal) {
        boolean deleted = researchPapersService.deletePaper(paperId);
        if (deleted) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "RESEARCH_PAPER",
                    String.valueOf(paperId), "DELETE", "Research paper removed");
        }
        return deleted;
    }

    @GetMapping("get-unique-papers-by-faculty-id/{facultyId}")
    public List<String> getPapersById(@PathVariable("facultyId") String facultyId) {
        return researchPapersService.getUniquePaperTitleByFaculty(facultyService.getFacultyById(facultyId));
    }

    @GetMapping("get-all-unique-faculty-ids-by-paper")
    public List<String> getAllUniqueStudentIdsByPapers() {
        return researchPapersService.getAllUniquePaperFacultyIds();
    }
}
