package com.itproject.rcpt.controllers.mongoLookupControllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.dto.staff.StaffCostRequest;
import com.itproject.rcpt.dto.staff.StaffCostResponse;
import com.itproject.rcpt.service.StaffCostService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/staff")
public class StaffCostController {

  private final StaffCostService service;

  public StaffCostController(StaffCostService service) {
    this.service = service;
  }

  /** List all staff costs for a project (DTOs). */
  @GetMapping
  public List<StaffCostResponse> list(@PathVariable String projectId) {
    return service.list(projectId);
  }

  /** Replace the entire staff cost list (returns updated list). */
  @PostMapping
  public List<StaffCostResponse> replaceAll(@PathVariable String projectId,
                                            @RequestBody List<StaffCostRequest> items) {
    return service.replaceAll(projectId, items);
  }

  /** Append one staff cost line (returns the new line). */
  @PostMapping("append")
  public StaffCostResponse append(@PathVariable String projectId,
                                  @RequestBody StaffCostRequest item) {
    return service.append(projectId, item);
  }

  /** Delete a staff cost by list index. */
  @DeleteMapping("{index}")
  public ResponseEntity<Void> deleteAt(@PathVariable String projectId, @PathVariable int index) {
    service.deleteAt(projectId, index);
    return ResponseEntity.noContent().build();
  }
}
