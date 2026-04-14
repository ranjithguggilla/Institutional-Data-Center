package com.example.demo.security;

public class UserSummaryDto {
    private String userName;
    private String role;

    public UserSummaryDto(String userName, String role) {
        this.userName = userName;
        this.role = role;
    }

    public String getUserName() {
        return userName;
    }

    public String getRole() {
        return role;
    }
}
