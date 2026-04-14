package com.example.demo.student.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.student.entity.Skill;
import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.SkillRepository;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public boolean skillExists(int skillId) {
        Optional<Skill> skill = skillRepository.findById(skillId);
        return skill.isPresent();
    }

    public boolean addSkill(Skill skill) {
        if (!skillExists(skill.getSkillId())) {
            skillRepository.save(skill);
            return true;
        }
        return false;
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public boolean deleteSkill(int skillId) {
        if (skillExists(skillId)) {
            skillRepository.deleteById(skillId);
            return true;
        }
        return false;
    }

    public Skill getSkillById(int skillId) {
        if(skillExists(skillId)) {
            return skillRepository.findById(skillId).get();
        }
        return new Skill();
        
    }

    public boolean updateSkill(Skill skill) {
        if (skillExists(skill.getSkillId())) {
            skillRepository.save(skill);
            return true;
        }
        return false;
    }
    
    public List<Skill> getSkillByStudent(Student student){
    	return skillRepository.findByStudent(student);
    }
    
    public List<String> getAllUniqueSkillDomains(){
    	return skillRepository.findAllUniqueDomains();
    }
    
    public List<String> getAllUniqueSkillDomainsByStudent(Student student){
    	return skillRepository.findAllUniqueDomainsByStudent(student);
    }
    
    public List<String> getAllUniqueStudentIdsBySkill(){
    	return skillRepository.findAllUniqueStudentIds();
    }
    
}