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
@Table(name = "research_papers")
public class ResearchPapers {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paperId")
	private int paperId;
	
	@Column(name = "published_title")
	private String publishedTitle;
	
	@Column(name = "published_year")
	private int publishedYear;
	
	@Column(name = "published_description")
	private String publishedDescription;
	
	@Column(name = "paper_references")
	private String paperReferences;
	
	@Column(name = "publishedBy")
	private String publishedBy;
	
    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;

	public ResearchPapers() {
	}

	public int getPaperId() {
		return paperId;
	}

	public void setPaperId(int paperId) {
		this.paperId = paperId;
	}

	public String getPublishedTitle() {
		return publishedTitle;
	}

	public void setPublishedTitle(String publishedTitle) {
		this.publishedTitle = publishedTitle;
	}

	public int getPublishedYear() {
		return publishedYear;
	}

	public void setPublishedYear(int publishedYear) {
		this.publishedYear = publishedYear;
	}

	public String getPublishedDescription() {
		return publishedDescription;
	}

	public void setPublishedDescription(String publishedDescription) {
		this.publishedDescription = publishedDescription;
	}

	public String getPaperReferences() {
		return paperReferences;
	}

	public void setPaperReferences(String paperReferences) {
		this.paperReferences = paperReferences;
	}

	public String getPublishedBy() {
		return publishedBy;
	}

	public void setPublishedBy(String publishedBy) {
		this.publishedBy = publishedBy;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	@Override
	public String toString() {
		return "{RESEARCHPAPERS:- publishedTitle=" + publishedTitle + ", publishedYear="
				+ publishedYear + ", publishedDescription=" + publishedDescription + ", paperReferences="
				+ paperReferences + ", publishedBy=" + publishedBy + "}";
	}
    
}