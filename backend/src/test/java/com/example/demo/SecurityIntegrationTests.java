package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityIntegrationTests {

    private final RestTemplate restTemplate = new RestTemplate();

    @LocalServerPort
    private int port;

    @BeforeEach
    void allowErrorStatuses() {
        restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) {
                return false;
            }
        });
    }

    private String baseUrl() {
        return "http://127.0.0.1:" + port;
    }

    @Test
    void studentEndpointsRejectUnauthenticatedRequests() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                baseUrl() + "/student/get-all-students", String.class);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void loginEndpointIsPublicAndRespondsForInvalidCredentials() {
        Map<String, String> payload = Map.of(
                "email", "invalid-user",
                "password", "invalid");
        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl() + "/auth/login", payload, String.class);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
