package com.example.demo.faculty.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "personal_documents")
public class PersonalDocuments {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "documentId")
	private int documentId;
	
	@OneToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
	
	@Column(name = "aadhar_card")
	private String aadharCard;
	
	@Column(name = "pan_card")
	private String panCard;

	public PersonalDocuments() {
	}

	public int getDocumentId() {
		return documentId;
	}

	public void setDocumentId(int documentId) {
		this.documentId = documentId;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public String getAadharCard() {
		return aadharCard;
	}

	public void setAadharCard(String aadharCard) {
		this.aadharCard = aadharCard;
	}

	public String getPanCard() {
		return panCard;
	}

	public void setPanCard(String panCard) {
		this.panCard = panCard;
	}

	@Override
	public String toString() {
		return "PersonalDocuments [documentId=" + documentId + ", faculty=" + faculty + ", aadharCard=" + aadharCard
				+ ", panCard=" + panCard + "]";
	}
	
}
