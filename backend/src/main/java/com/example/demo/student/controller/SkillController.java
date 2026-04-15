package com.example.demo.student.controller;

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
import com.example.demo.student.entity.Skill;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.SkillService;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("skill")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final StudentService studentService;
    private final GovernanceService governanceService;

    @PostMapping("add-skill")
    public boolean addSkill(@RequestBody Skill skill, Principal principal) {
        Student student = studentService.getStudentById(principal.getName());
        skill.setStudent(student);
        boolean created = skillService.addSkill(skill);
        if (created) {
            governanceService.recordChange(principal.getName(), "SKILL", student.getStudentId(), "CREATE",
                    "Skill added: " + skill.getSkill());
        }
        return created;
    }

    @GetMapping("get-skill/{skillId}")
    public Skill getSkillById(@PathVariable("skillId") int skillId) {
        return skillService.getSkillById(skillId);
    }

    @GetMapping("get-all-skills")
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("get-all-skills-by-id")
    public List<Skill> getSkillsById(Principal principal) {
        return skillService.getSkillByStudent(studentService.getStudentById(principal.getName()));
    }

    @GetMapping("get-all-skills-by-id/{studentId}")
    public List<Skill> getSkillsNormalById(@PathVariable("studentId") String studentId) {
        return skillService.getSkillByStudent(studentService.getStudentById(studentId));
    }

    @GetMapping("get-all-skills-by-student-id/{studentId}")
    public List<Skill> getSkillsById(@PathVariable("studentId") String studentId) {
        return skillService.getSkillByStudent(studentService.getStudentById(studentId));
    }

    @GetMapping("get-all-unique-skills-by-student-id/{studentId}")
    public List<String> getSkillsByStudentId(@PathVariable("studentId") String studentId) {
        return skillService.getAllUniqueSkillDomainsByStudent(studentService.getStudentById(studentId));
    }

    @GetMapping("get-all-unique-student-ids-by-skill")
    public List<String> getAllUniqueStudentIdsBySkill() {
        return skillService.getAllUniqueStudentIdsBySkill();
    }

    @GetMapping("get-unique-skills")
    public List<String> getUniqueSkills() {
        return skillService.getAllUniqueSkillDomains();
    }

    @PutMapping("update-skill/{skillId}")
    public boolean updateSkill(@PathVariable("skillId") int skillId, @RequestBody Skill skill, Principal principal) {
        boolean updated = skillService.updateSkill(skill);
        if (updated) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "SKILL", String.valueOf(skillId),
                    "UPDATE", "Skill updated: " + skill.getSkill());
        }
        return updated;
    }

    @DeleteMapping("delete-skill/{skillId}")
    public boolean deleteSkill(@PathVariable("skillId") int skillId, Principal principal) {
        boolean deleted = skillService.deleteSkill(skillId);
        if (deleted) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "SKILL", String.valueOf(skillId),
                    "DELETE", "Skill removed");
        }
        return deleted;
    }
}
