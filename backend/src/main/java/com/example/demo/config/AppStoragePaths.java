package com.example.demo.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Writable upload directories on disk. Avoids saving under {@code src/main/resources/static},
 * which Spring serves from {@code target/classes} — new files there are often invisible until rebuild.
 */
@Component
public class AppStoragePaths {

    private final Path facultyProfilePictures;

    public AppStoragePaths(@Value("${app.storage.root:}") String configuredRoot) throws IOException {
        Path base = (configuredRoot == null || configuredRoot.isBlank())
                ? Paths.get(System.getProperty("user.dir"), "app-uploads")
                : Paths.get(configuredRoot);
        this.facultyProfilePictures = base.resolve("faculty_profile_pictures").toAbsolutePath().normalize();
        Files.createDirectories(this.facultyProfilePictures);
    }

    public Path getFacultyProfilePictures() {
        return facultyProfilePictures;
    }
}
