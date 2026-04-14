package com.example.demo.student.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill")
public class Skill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skillId")
    private int skillId;
    
    @Column(name = "skill")
    private String skill;
    
    @Column(name = "domain")
    private String domain;
    
    @ManyToOne
    @JoinColumn(name = "studentId")
    private Student student;
    
    public Skill() {}
    
    public Skill(int skillId, String skill, String domain, Student student) {
		super();
		this.skillId = skillId;
		this.skill = skill;
		this.domain = domain;
		this.student = student;
	}

	public int getSkillId() {
        return skillId;
    }
    
    public void setSkillId(int skillId) {
        this.skillId = skillId;
    }
    
    public String getSkill() {
        return skill;
    }
    
    public void setSkill(String skill) {
        this.skill = skill;
    }
    
    public String getDomain() {
        return domain;
    }
    
    public void setDomain(String domain) {
        this.domain = domain;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }

	@Override
	public String toString() {
		return "{SKILL:- skill=" + skill + ", domain=" + domain + "}";
	}
    
}