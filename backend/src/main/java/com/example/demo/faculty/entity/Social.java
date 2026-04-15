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
@Table(name = "social")
public class Social {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "socialId")
    private int socialId;
    
    @OneToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
    
    @Column(name = "github")
    private String github;
    
    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "googleScholar")
    private String googleScholar;

    @Column(name = "orcid")
    private String orcid;

    @Column(name = "researchGate")
    private String researchGate;

    /** Personal site / lab page / portfolio URL */
    @Column(name = "portfolioUrl")
    private String portfolioUrl;

	public Social() {}

	public Social(int socialId, Faculty faculty, String github, String linkedin) {
		super();
		this.socialId = socialId;
		this.faculty = faculty;
		this.github = github;
		this.linkedin = linkedin;
	}

	public int getSocialId() {
		return socialId;
	}

	public void setSocialId(int socialId) {
		this.socialId = socialId;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public String getGithub() {
		return github;
	}

	public void setGithub(String github) {
		this.github = github;
	}

	public String getLinkedin() {
		return linkedin;
	}

	public void setLinkedin(String linkedin) {
		this.linkedin = linkedin;
	}

	public String getGoogleScholar() {
		return googleScholar;
	}

	public void setGoogleScholar(String googleScholar) {
		this.googleScholar = googleScholar;
	}

	public String getOrcid() {
		return orcid;
	}

	public void setOrcid(String orcid) {
		this.orcid = orcid;
	}

	public String getResearchGate() {
		return researchGate;
	}

	public void setResearchGate(String researchGate) {
		this.researchGate = researchGate;
	}

	public String getPortfolioUrl() {
		return portfolioUrl;
	}

	public void setPortfolioUrl(String portfolioUrl) {
		this.portfolioUrl = portfolioUrl;
	}

	@Override
	public String toString() {
		return "Social [socialId=" + socialId + ", faculty=" + faculty + ", github=" + github + ", linkedin=" + linkedin
				+ "]";
	}
	
}
