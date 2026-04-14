package com.example.demo.faculty.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "experience")
public class Experience {
    
    @Id
    @Column(name = "experienceId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int experienceId;
    
    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
    
    @Column(name = "experienceType")
    private String experienceType;
    
    @Column(name = "experienceFrom")
    private Date experienceFrom;
    
    @Column(name = "experienceTo")
    private Date experienceTo;
    
    @Column(name = "company")
    private String company;
    
    @Column(name = "designation")
    private String designation;

	public Experience() {}

	public Experience(int experienceId, Faculty faculty, String experienceType, Date experienceFrom,
			Date experienceTo, String company, String designation) {
		super();
		this.experienceId = experienceId;
		this.faculty = faculty;
		this.experienceType = experienceType;
		this.experienceFrom = experienceFrom;
		this.experienceTo = experienceTo;
		this.company = company;
		this.designation = designation;
	}
	
	public int getExperienceId() {
		return experienceId;
	}

	public void setExperienceId(int experienceId) {
		this.experienceId = experienceId;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public String getExperienceType() {
		return experienceType;
	}

	public void setExperienceType(String experienceType) {
		this.experienceType = experienceType;
	}

	public Date getExperienceFrom() {
		return experienceFrom;
	}

	public void setExperienceFrom(Date experienceFrom) {
		this.experienceFrom = experienceFrom;
	}

	public Date getExperienceTo() {
		return experienceTo;
	}

	public void setExperienceTo(Date experienceTo) {
		this.experienceTo = experienceTo;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	@Override
	public String toString() {
		return "{EXPERIENCE experienceType=" + experienceType + ", experienceFrom=" + experienceFrom + 
				", experienceTo=" + experienceTo + ", company=" + company + ", designation=" + designation + "}";
	}
    
}