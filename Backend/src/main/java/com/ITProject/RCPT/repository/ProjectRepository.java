package com.itproject.rcpt.repository;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
  Page<Project> findByOwnerUserId(String ownerUserId, Pageable pageable);
  Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
}
