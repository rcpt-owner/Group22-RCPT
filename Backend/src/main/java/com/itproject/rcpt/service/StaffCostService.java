package com.itproject.rcpt.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.domain.StaffCost;
import com.itproject.rcpt.dto.staff.StaffCostRequest;
import com.itproject.rcpt.dto.staff.StaffCostResponse;
import com.itproject.rcpt.mapper.ProjectMapper;
import com.itproject.rcpt.repository.ProjectRepository;

@Service
public class StaffCostService {

  private final ProjectRepository projectRepository;
  private final ProjectMapper mapper;

  public StaffCostService(ProjectRepository projectRepository, ProjectMapper mapper) {
    this.projectRepository = projectRepository;
    this.mapper = mapper;
  }

  /** Get as DTOs. */
  public List<StaffCostResponse> list(String projectId) {
    Project p = getProjectOrThrow(projectId);
    List<StaffCost> src = p.getStaffCosts() == null ? List.of() : p.getStaffCosts();
    return mapper.toStaffCostResponseList(src);
  }

  /** Replace entire list, return updated list as DTOs. */
  public List<StaffCostResponse> replaceAll(String projectId, List<StaffCostRequest> items) {
    Project p = getProjectOrThrow(projectId);
    List<StaffCost> newList = toStaffCostList(items);
    p.setStaffCosts(newList);
    projectRepository.save(p);
    return mapper.toStaffCostResponseList(p.getStaffCosts());
  }

  /** Append a single item, return it as DTO. */
  public StaffCostResponse append(String projectId, StaffCostRequest item) {
    Project p = getProjectOrThrow(projectId);
    List<StaffCost> list = p.getStaffCosts();
    if (list == null) {
      list = new ArrayList<>();
      p.setStaffCosts(list);
    }
    StaffCost entity = mapper.toStaffCost(item);
    list.add(entity);
    projectRepository.save(p);
    return mapper.toStaffCostResponse(entity);
  }

  /** Delete by index. */
  public void deleteAt(String projectId, int index) {
    Project p = getProjectOrThrow(projectId);
    List<StaffCost> list = p.getStaffCosts();
    if (list == null || index < 0 || index >= list.size()) {
      throw new IllegalArgumentException("Invalid staff index: " + index);
    }
    list.remove(index);
    projectRepository.save(p);
  }

  private Project getProjectOrThrow(String id) {
    return projectRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Project not found: " + id));
  }

  /** local helper to avoid NPEs */
  private List<StaffCost> toStaffCostList(List<StaffCostRequest> src) {
    if (src == null) return new ArrayList<>();
    List<StaffCost> out = new ArrayList<>();
    for (var r : src) out.add(mapper.toStaffCost(r));
    return out;
  }
}
