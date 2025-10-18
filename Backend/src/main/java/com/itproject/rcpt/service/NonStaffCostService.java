package com.itproject.rcpt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.itproject.rcpt.domain.NonStaffCost;
import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostResponse;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;

@Service
public class NonStaffCostService {

  private final ProjectRepository projectRepository;
  private final ProjectMapper mapper;

  public NonStaffCostService(ProjectRepository projectRepository, ProjectMapper mapper) {
    this.projectRepository = projectRepository;
    this.mapper = mapper;
  }

  /** Get as DTOs. */
  public List<NonStaffCostResponse> list(String projectId) {
    Project p = getProjectOrThrow(projectId);
    List<NonStaffCost> src = p.getNonStaffCosts() == null ? List.of() : p.getNonStaffCosts();
    return mapper.toNonStaffResponseList(src);
  }

  /** Replace entire list, return updated list as DTOs. */
  public List<NonStaffCostResponse> replaceAll(String projectId, List<NonStaffCostRequest> items) {
    Project p = getProjectOrThrow(projectId);
    List<NonStaffCost> newList = mapper.toNonStaffList(items);
    if (newList == null) newList = new ArrayList<>();
    p.setNonStaffCosts(newList);
    projectRepository.save(p);
    return mapper.toNonStaffResponseList(p.getNonStaffCosts());
  }

  /** Append a single item, return it as DTO. */
  public NonStaffCostResponse append(String projectId, NonStaffCostRequest item) {
    Project p = getProjectOrThrow(projectId);
    List<NonStaffCost> list = p.getNonStaffCosts();
    if (list == null) {
      list = new ArrayList<>();
      p.setNonStaffCosts(list);
    }
    NonStaffCost entity = mapper.toNonStaff(item);
    list.add(entity);
    projectRepository.save(p);
    return mapper.toNonStaffResponse(entity);
  }

  /** Delete by index. */
  public void deleteAt(String projectId, int index) {
    Project p = getProjectOrThrow(projectId);
    List<NonStaffCost> list = p.getNonStaffCosts();
    if (list == null || index < 0 || index >= list.size()) {
      throw new IllegalArgumentException("Invalid non-staff index: " + index);
    }
    list.remove(index);
    projectRepository.save(p);
  }

  private Project getProjectOrThrow(String id) {
    return projectRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Project not found: " + id));
  }
}
