package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.ResearchPapers;
import com.example.demo.faculty.repository.ResearchPapersRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResearchPapersService {
    
    private final ResearchPapersRepository researchPapersRepository;
    
    public boolean paperExists(Integer paperId) {
        Optional<ResearchPapers> paper = researchPapersRepository.findById(paperId);
        return paper.isPresent();
    }
    
    public boolean addPaper(ResearchPapers paper) {
        if (!paperExists(paper.getPaperId())) {
            researchPapersRepository.save(paper);
            return true;
        }
        return false;
    }
    
    public List<ResearchPapers> getAllPapers() {
        return researchPapersRepository.findAll();
    }
    
    public boolean deletePaper(Integer paperId) {
        if (paperExists(paperId)) {
            researchPapersRepository.deleteById(paperId);
            return true;
        }
        return false;
    }
    
    public ResearchPapers getPaperById(Integer paperId) {
        Optional<ResearchPapers> paper = researchPapersRepository.findById(paperId);
        return paper.orElse(null); 
    }
    
    public boolean updatePaper(ResearchPapers paper) {
        if (paperExists(paper.getPaperId())) {
            researchPapersRepository.save(paper);
            return true;
        }
        return false;
    }
    
    public List<ResearchPapers> getByFacultyObject(Faculty faculty) {
    	return researchPapersRepository.findByFaculty(faculty);
    }
    
    public List<String> getAllUniquePaperFacultyIds(){
    	return researchPapersRepository.findAllUniqueResearchPapersFacultyIds();
    }
    
    public List<String> getUniquePaperTitleByFaculty(Faculty faculty){
    	return researchPapersRepository.findUniqueResearchPapersCompanyByFaculty(faculty);
    }
}