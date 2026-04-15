package com.example.demo.faculty;

import com.example.demo.faculty.entity.Faculty;

/**
 * {@link com.example.demo.faculty.service.FacultyService#getFacultyById(String)} returns a
 * placeholder {@link Faculty} with no id when no row exists; JPA queries by that entity can error.
 */
public final class FacultyEntityChecks {

    private FacultyEntityChecks() {}

    public static boolean isPersisted(Faculty f) {
        return f != null && f.getFacultyId() != null && !f.getFacultyId().isBlank();
    }
}
