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
@Table(name = "faculty_project")
public class FacultyProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "projectId")
    private int projectId;
    
    @Column(name = "projectTitle")
    private String projectTitle;
	
    @ManyToOne
    @JoinColumn(name = "facultyId")
    private Faculty faculty;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "url")
    private String url;
    
    @Column(name = "verificationUrl")
    private String verificationUrl;

    public FacultyProject() {}

    public FacultyProject(int projectId, String projectTitle, Faculty faculty, String description, String tags, String url,
            String verificationUrl) {
        super();
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.faculty = faculty;
        this.description = description;
        this.tags = tags;
        this.url = url;
        this.verificationUrl = verificationUrl;
    }

    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }
    
    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getVerificationUrl() {
        return verificationUrl;
    }

    public void setVerificationUrl(String verificationUrl) {
        this.verificationUrl = verificationUrl;
    }

    @Override
    public String toString() {
        return "{PROJECT:- projectTitle=" + projectTitle
                + ", description=" + description + ", tags=" + tags + ", url=" + url + "}";
    }
}