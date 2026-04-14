package com.example.demo.student.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.StudentRepository;

@Service
@RequiredArgsConstructor
public class StudentService {
	
	private final StudentRepository studentRepository;
	
	public boolean studentExist(String studentId) {
		Optional<Student> student = studentRepository.findById(studentId);
		return student.isPresent();
	}
	
	public boolean addStudent(Student student) {
		if(!studentExist(student.getStudentId())) {
			studentRepository.save(student);		
			return true;
		}
		return false;
	}

	public List<Student> getStudents() {
		return studentRepository.findAll();
	}
	
	public List<Student> getStudentsByDepartment(String department) {
		return studentRepository.findByDepartment(department);
	}

	public boolean deleteStudent(String studentId) {
		if(studentExist(studentId)) {
			studentRepository.deleteById(studentId);
			return true;
		}
		return false;
	}

	public Student getStudentById(String studentId) {
		if(studentExist(studentId)) {
			return studentRepository.findById(studentId).get();
		}
		else {
			return new Student();
		}
	}

	public boolean updateStudent(Student student) {
		if(studentExist(student.getStudentId())) {
			studentRepository.save(student);
			return true;
		}
		return false;
	}
	
	public List<String> getAllUniqueBatches(){
		return studentRepository.findAllUniqueBatches();
	}
	
	public List<String> getAllUniqueDepartments(){
		return studentRepository.findAllUniqueDepartments();
	}
}
