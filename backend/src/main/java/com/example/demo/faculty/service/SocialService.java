package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.Social;
import com.example.demo.faculty.repository.SocialRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.example.demo.faculty.FacultyEntityChecks;

@Service
@RequiredArgsConstructor
public class SocialService {

    private final SocialRepository socialRepository;

    public boolean socialExists(int socialId) {
        Optional<Social> social = socialRepository.findById(socialId);
        return social.isPresent();
    }

    public boolean addSocial(Social social) {
        if (!socialExists(social.getSocialId())) {
            socialRepository.save(social);
            return true;
        }
        return false;
    }

    public List<Social> getAllSocials() {
        return socialRepository.findAll();
    }

    public boolean deleteSocial(int socialId) {
        if (socialExists(socialId)) {
            socialRepository.deleteById(socialId);
            return true;
        }
        return false;
    }

    public Social getSocialById(int socialId) {
        Optional<Social> social = socialRepository.findById(socialId);
        if(social.isPresent()) {
        	return social.get();
        }
        return new Social();
    }

    public boolean updateSocial(Social social) {
        if (socialExists(social.getSocialId())) {
            socialRepository.save(social);
            return true;
        }
        return false;
    }
    
    public List<Social> getSocialByFaculty(Faculty faculty){
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
    	return socialRepository.findByFaculty(faculty);
    }
}