package com.example.demo.student.entity;

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
@Table(name = "internship")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "internshipId")
    private int internshipId;
    
    @Column(name = "internshipName")
	private String internshipName;
    
    @Column(name = "companyName")
    private String companyName;
    
    @Column(name = "startDate")
    private Date startDate;

    @Column(name = "endDate")
    private Date endDate;
    
    @ManyToOne
    @JoinColumn(name = "studentId")
    private Student student;
    
    @Column(name = "verification")
    private String verification;
    
    @Column(name = "domain")
    private String domain;
    
    @Column(name = "internshipType")
    private String internshipType;

	public Internship() {}

	public Internship(int internshipId, String internshipName, String companyName, Date startDate, Date endDate,
			Student student, String verification, String domain, String internshipType) {
		super();
		this.internshipId = internshipId;
		this.internshipName = internshipName;
		this.companyName = companyName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.student = student;
		this.verification = verification;
		this.domain = domain;
		this.internshipType = internshipType;
	}

	public int getInternshipId() {
		return internshipId;
	}

	public void setInternshipId(int internshipId) {
		this.internshipId = internshipId;
	}

	public String getInternshipName() {
		return internshipName;
	}

	public void setInternshipName(String internshipName) {
		this.internshipName = internshipName;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public String getVerification() {
		return verification;
	}

	public void setVerification(String verification) {
		this.verification = verification;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public String getInternshipType() {
		return internshipType;
	}

	public void setInternshipType(String internshipType) {
		this.internshipType = internshipType;
	}

	@Override
	public String toString() {
		return "{INTERNSHIP:- internshipName=" + internshipName + ", companyName=" + companyName + ", startDate=" + startDate +
				", endDate=" + endDate + ", domain=" + domain + ", internshipType=" + internshipType + "}";
	}
	
}
