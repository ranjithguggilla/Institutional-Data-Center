package com.example.demo.faculty.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.sql.Date;

@Entity
@Table(name = "faculty_certification")
public class FacultyCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificationId")
    private int certificationId;
    
    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
    
    @Column(name = "certificationName")
    private String certificationName;
    
    @Column(name = "expiryDate")
    private Date expiryDate;
    
    @Column(name = "type")
    private String type;
    
    @Column(name = "verification")
    private String verification;
    
    @Column(name = "certify")
    private String certify;

	public FacultyCertification() {}

	public FacultyCertification(int certificationId, Faculty faculty, String certificationName, Date expiryDate,
			String verification, String certify) {
		super();
		this.certificationId = certificationId;
		this.faculty = faculty;
		this.certificationName = certificationName;
		this.expiryDate = expiryDate;
		this.verification = verification;
		this.certify = certify;
	}

	public int getCertificationId() {
		return certificationId;
	}

	public void setCertificationId(int certificationId) {
		this.certificationId = certificationId;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public String getCertificationName() {
		return certificationName;
	}

	public void setCertificationName(String certificationName) {
		this.certificationName = certificationName;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getVerification() {
		return verification;
	}

	public void setVerification(String verification) {
		this.verification = verification;
	}

	public String getCertify() {
		return certify;
	}

	public void setCertify(String certify) {
		this.certify = certify;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "{CERTIFICATION:- certificationName="
				+ certificationName + ", expiryDate=" + expiryDate + ", type=" + type + ", verification=" + verification
				+ "}";
	}
    
}