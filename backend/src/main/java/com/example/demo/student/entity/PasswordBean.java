package com.example.demo.student.entity;

import java.beans.JavaBean;

@JavaBean
public class PasswordBean {

	private String currentPassword;
	
	private String newPassword;

	public PasswordBean() {}

	public String getCurrentPassword() {
		return currentPassword;
	}

	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public PasswordBean(String currentPassword, String newPassword) {
		super();
		this.currentPassword = currentPassword;
		this.newPassword = newPassword;
	}

	@Override
	public String toString() {
		return "PasswordBean [currentPassword=" + currentPassword + ", newPassword=" + newPassword + "]";
	}
	
}
