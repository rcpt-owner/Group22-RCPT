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
  public StaffCostController(StaffCostService service) { this.service = service; }

  @GetMapping
  public List<StaffCostResponse> list(@PathVariable String projectId) {
    return service.list(projectId);
  }

  @PostMapping
  public List<StaffCostResponse> replaceAll(@PathVariable String projectId,
                                            @RequestBody List<StaffCostRequest> items) {
    return service.replaceAll(projectId, items);
  }

  @PostMapping("append")
  public StaffCostResponse append(@PathVariable String projectId,
                                  @RequestBody StaffCostRequest item) {
    return service.append(projectId, item);
  }

  @DeleteMapping("{index}")
  public ResponseEntity<Void> deleteAt(@PathVariable String projectId, @PathVariable int index) {
    service.deleteAt(projectId, index);
    return ResponseEntity.noContent().build();
  }
}
