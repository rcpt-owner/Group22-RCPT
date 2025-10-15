package com.itproject.rcpt;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uom.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.uom.rcpt.dto.nonstaffcost.NonStaffCostResponse;
import com.uom.rcpt.service.NonStaffCostService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/nonstaff")
public class NonStaffCostController {

  private final NonStaffCostService service;
  public NonStaffCostController(NonStaffCostService service) { this.service = service; }

  @GetMapping
  public List<NonStaffCostResponse> list(@PathVariable String projectId) {
    return service.list(projectId);
  }

  @PostMapping
  public List<NonStaffCostResponse> replaceAll(@PathVariable String projectId,
                                               @RequestBody List<NonStaffCostRequest> items) {
    return service.replaceAll(projectId, items);
  }

  @PostMapping("append")
  public NonStaffCostResponse append(@PathVariable String projectId,
                                     @RequestBody NonStaffCostRequest item) {
    return service.append(projectId, item);
  }

  @DeleteMapping("{index}")
  public ResponseEntity<Void> deleteAt(@PathVariable String projectId, @PathVariable int index) {
    service.deleteAt(projectId, index);
    return ResponseEntity.noContent().build();
  }
}
