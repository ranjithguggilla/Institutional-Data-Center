package com.example.demo.student.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student")
public class Student {
	
	@Id
	@Column(name = "studentId")
	private String studentId;
	
	@Column(name = "studentName")
	private String studentName;
	
	@Column(name = "studentGender")
	private boolean studentGender;
	
	@Column(name = "batch")
	private String batch;
	
	@Column(name = "emailId")
	private String emailId;
	
	@Column(name = "mobileNumber")
	private String mobileNumber;

	@Column(name = "linkedinUrl")
	private String linkedinUrl;

	@Column(name = "githubUrl")
	private String githubUrl;
	
	@Column(name = "cgpa")
	private String cgpa;
	
	@Column(name = "profilePicture")
	private String profilePicture;
	
    @Column(name = "department")
    private String department;

	public Student() {}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public void setGithubUrl(String githubUrl) {
		this.githubUrl = githubUrl;
	}

	public String getCgpa() {
		return cgpa;
	}

	public void setCgpa(String cgpa) {
		this.cgpa = cgpa;
	}

	public boolean isStudentGender() {
		return studentGender;
	}

	public void setStudentGender(boolean studentGender) {
		this.studentGender = studentGender;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", studentName=" + studentName + ", studentGender=" + studentGender
				+ ", batch=" + batch + ", emailId=" + emailId + ", mobileNumber=" + mobileNumber + ", cgpa=" + cgpa
				+ ", profilePicture=" + profilePicture + ", department=" + department + ", linkedinUrl=" + linkedinUrl
				+ ", githubUrl=" + githubUrl + "]";
	}
	
}
