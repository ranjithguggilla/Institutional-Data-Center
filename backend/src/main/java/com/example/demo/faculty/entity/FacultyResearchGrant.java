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
@Table(name = "faculty_research_grant")
public class FacultyResearchGrant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grantId")
    private int grantId;

    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;

    @Column(name = "title")
    private String title;

    @Column(name = "fundingAgency")
    private String fundingAgency;

    @Column(name = "amount")
    private String amount;

    @Column(name = "startDate", nullable = true)
    private Date startDate;

    @Column(name = "endDate", nullable = true)
    private Date endDate;

    @Column(name = "description")
    private String description;

    @Column(name = "projectUrl")
    private String projectUrl;

    public FacultyResearchGrant() {}

    public int getGrantId() {
        return grantId;
    }

    public void setGrantId(int grantId) {
        this.grantId = grantId;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFundingAgency() {
        return fundingAgency;
    }

    public void setFundingAgency(String fundingAgency) {
        this.fundingAgency = fundingAgency;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
}
