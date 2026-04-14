package com.example.demo.faculty.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recent_education")
public class RecentEducation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId")
    private int userId;
    
    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
    
    @Column(name = "type")
    private String type;
    
    @Column(name = "issuedBy")
    private String issuedBy;

	public RecentEducation() {}

	public RecentEducation(int userId, Faculty faculty, String type, String issuedBy) {
		super();
		this.userId = userId;
		this.faculty = faculty;
		this.type = type;
		this.issuedBy = issuedBy;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIssuedBy() {
		return issuedBy;
	}

	public void setIssuedBy(String issuedBy) {
		this.issuedBy = issuedBy;
	}

	@Override
	public String toString() {
		return "RecentEducation [userId=" + userId + ", faculty=" + faculty + ", type=" + type + ", issuedBy="
				+ issuedBy + "]";
	}

}