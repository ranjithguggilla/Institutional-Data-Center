package com.example.demo.security;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String>{

	Optional<User> findByUserName(String username);

	List<User> findAllByOrderByUserNameAsc();

	@Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
	List<Object[]> countUsersByRole();

}
