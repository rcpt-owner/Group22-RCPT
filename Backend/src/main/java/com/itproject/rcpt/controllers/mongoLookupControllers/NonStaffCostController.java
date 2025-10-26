package com.itproject.rcpt.controllers.mongoLookupControllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostResponse;
import com.itproject.rcpt.service.NonStaffCostService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/nonstaff")
public class NonStaffCostController {

  private final NonStaffCostService service;

  public NonStaffCostController(NonStaffCostService service) {
    this.service = service;
  }

  /** List all non-staff costs for a project (DTOs). */
  @GetMapping
  public List<NonStaffCostResponse> list(@PathVariable String projectId) {
    return service.list(projectId);
  }

  /** Replace the entire non-staff cost list with the provided items (returns updated list). */
  @PostMapping
  public List<NonStaffCostResponse> replaceAll(@PathVariable String projectId,
                                               @RequestBody List<NonStaffCostRequest> items) {
    return service.replaceAll(projectId, items);
  }

  /** Append one non-staff cost line (returns the new line). */
  @PostMapping("append")
  public NonStaffCostResponse append(@PathVariable String projectId,
                                     @RequestBody NonStaffCostRequest item) {
    return service.append(projectId, item);
  }

  /** Delete a non-staff cost by list index. */
  @DeleteMapping("{index}")
  public ResponseEntity<Void> deleteAt(@PathVariable String projectId, @PathVariable int index) {
    service.deleteAt(projectId, index);
    return ResponseEntity.noContent().build();
  }
}
