package com.example.demo.faculty.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "faculty")
public class Faculty {
    
	@Id
    @Column(name = "facultyId")
    private String facultyId;
    
    @Column(name = "facultyName")
    private String facultyName;
    
    @Column(name = "gender")
    private boolean gender;
    
    @Column(name = "dateOfBirth")
    private Date dateOfBirth;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "emailId")
    private String emailId;
    
    @Column(name = "contactNumber")
    private String contactNumber;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "designation")
    private String designation;
    
	@Column(name = "profilePicture")
	private String profilePicture;

    public Faculty() {}

    public String getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(String facultyId) {
        this.facultyId = facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public boolean getGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
	
	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	@Override
	public String toString() {
		return "Faculty [facultyId=" + facultyId + ", facultyName=" + facultyName + ", gender=" + gender
				+ ", dateOfBirth=" + dateOfBirth + ", department=" + department + ", emailId=" + emailId
				+ ", contactNumber=" + contactNumber + ", address=" + address + ", designation=" + designation
				+ ", profilePicture=" + profilePicture + "]";
	}
	
}