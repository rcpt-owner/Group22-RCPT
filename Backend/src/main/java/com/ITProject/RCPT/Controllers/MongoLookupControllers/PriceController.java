package com.itproject.rcpt;

import org.springframework.web.bind.annotation.*;

import com.itproject.rcpt.dto.price.PriceSummaryResponse;
import com.itproject.rcpt.service.PriceService;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/price")
public class PriceController {

  private final PriceService service;
  public PriceController(PriceService service) { this.service = service; }

  @PostMapping("recompute")
  public PriceSummaryResponse recompute(@PathVariable String projectId) {
    return service.recompute(projectId);
  }

  @GetMapping("summary")
  public PriceSummaryResponse summary(@PathVariable String projectId) {
    return service.getSummary(projectId);
  }
}
