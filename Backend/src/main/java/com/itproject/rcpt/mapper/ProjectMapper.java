package com.itproject.rcpt.mapper;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.itproject.rcpt.domain.*;
import com.itproject.rcpt.domain.value.Money;
import com.itproject.rcpt.domain.value.YearAllocation;
import com.itproject.rcpt.dto.common.MoneyDto;
import com.itproject.rcpt.dto.common.YearAllocationDto;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostRequest;
import com.itproject.rcpt.dto.nonstaffcost.NonStaffCostResponse;
import com.itproject.rcpt.dto.price.PriceSummaryResponse;
import com.itproject.rcpt.dto.project.*;
import com.itproject.rcpt.dto.staff.StaffCostRequest;
import com.itproject.rcpt.dto.staff.StaffCostResponse;

/**
 * ProjectMapper handles all DTO and domain conversions.
 * It ensures data from API requests is mapped into domain models and vice versa.
 * This keeps controllers lightweight and isolates conversion logic.
 */
@Mapper(
    componentModel = "spring",
    injectionStrategy = InjectionStrategy.CONSTRUCTOR,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ProjectMapper {

  // ---------- Money & YearAllocation Mappers ----------

  /** Convert DTO to Money domain object */
  default Money toMoney(MoneyDto dto) {
    if (dto == null) return null;
    var m = new Money();
    m.setAmount(dto.getAmount());
    m.setCurrency(dto.getCurrency());
    return m;
  }

  /** Convert domain to DTO */
  default MoneyDto toMoneyDto(Money m) {
    if (m == null) return null;
    var dto = new MoneyDto();
    dto.setAmount(m.getAmount());
    dto.setCurrency(m.getCurrency());
    return dto;
  }

  /** Convert DTO to YearAllocation */
  default YearAllocation toYearAllocation(YearAllocationDto dto) {
    if (dto == null) return null;
    var ya = new YearAllocation();
    ya.setYear(dto.getYear() == null ? 0 : dto.getYear());
    ya.setValue(dto.getValue());
    return ya;
  }

  /** Convert domain to YearAllocation DTO */
  default YearAllocationDto toYearAllocationDto(YearAllocation ya) {
    if (ya == null) return null;
    var dto = new YearAllocationDto();
    dto.setYear(ya.getYear());
    dto.setValue(ya.getValue());
    return dto;
  }

  // ---------- Project Details Mapping ----------

  ProjectDetails toDetails(ProjectDetailsDto dto);
  ProjectDetailsDto toDetailsDto(ProjectDetails d);

  // ---------- Staff Cost Mappers ----------

  StaffCost toStaffCost(StaffCostRequest req);
  StaffCostResponse toStaffCostResponse(StaffCost s);

  default List<StaffCost> toStaffCostList(List<StaffCostRequest> src) {
    if (src == null) return new ArrayList<>();
    List<StaffCost> out = new ArrayList<>();
    for (var r : src) out.add(toStaffCost(r));
    return out;
  }

  default List<StaffCostResponse> toStaffCostResponseList(List<StaffCost> src) {
    if (src == null) return new ArrayList<>();
    List<StaffCostResponse> out = new ArrayList<>();
    for (var s : src) out.add(toStaffCostResponse(s));
    return out;
  }

  // ---------- Non-Staff Cost Mappers ----------

  /** Convert request DTO to NonStaffCost domain object */
  default NonStaffCost toNonStaff(NonStaffCostRequest req) {
    if (req == null) return null;
    var n = new NonStaffCost();
    n.setCategoryCode(req.getCategoryCode());         
    n.setExpenseTypeCode(req.getExpenseTypeCode());     
    n.setDescription(req.getDescription());
    n.setUnitCost(toMoney(req.getUnitCost()));
    n.setUnits(req.getUnits());

    if (req.getPerYearUnits() != null) {
      List<YearAllocation> per = new ArrayList<>();
      for (var y : req.getPerYearUnits()) per.add(toYearAllocation(y));
      n.setPerYearUnits(per);
    }

    n.setInKind(Boolean.TRUE.equals(req.getInKind()));
    n.setNotes(req.getNotes());
    return n;
  }

  /** Convert domain object to response DTO */
  default NonStaffCostResponse toNonStaffResponse(NonStaffCost n) {
    if (n == null) return null;
    var dto = new NonStaffCostResponse();
    dto.setCategoryCode(n.getCategoryCode());           
    dto.setExpenseTypeCode(n.getExpenseTypeCode());
    dto.setDescription(n.getDescription());
    dto.setUnitCost(toMoneyDto(n.getUnitCost()));
    dto.setUnits(n.getUnits());

    if (n.getPerYearUnits() != null) {
      List<YearAllocationDto> per = new ArrayList<>();
      for (var y : n.getPerYearUnits()) per.add(toYearAllocationDto(y));
      dto.setPerYearUnits(per);
    }

    dto.setInKind(n.isInKind());
    dto.setNotes(n.getNotes());
    return dto;
  }

  default List<NonStaffCost> toNonStaffList(List<NonStaffCostRequest> src) {
    if (src == null) return new ArrayList<>();
    List<NonStaffCost> out = new ArrayList<>();
    for (var r : src) out.add(toNonStaff(r));
    return out;
  }

  default List<NonStaffCostResponse> toNonStaffResponseList(List<NonStaffCost> src) {
    if (src == null) return new ArrayList<>();
    List<NonStaffCostResponse> out = new ArrayList<>();
    for (var n : src) out.add(toNonStaffResponse(n));
    return out;
  }

  // ---------- Approval History Mapping ----------

  default ApprovalEntryResponse toApprovalEntryResponse(ApprovalEntry e) {
    if (e == null) return null;
    var dto = new ApprovalEntryResponse();
    dto.setAction(e.getAction());
    dto.setActorUserId(e.getActorUserId());
    dto.setComment(e.getComment());
    dto.setAt(e.getAt());
    return dto;
  }

  default List<ApprovalEntryResponse> toApprovalHistoryResponse(ApprovalTracker tracker) {
    if (tracker == null || tracker.getHistory() == null) return new ArrayList<>();
    List<ApprovalEntryResponse> out = new ArrayList<>();
    for (var e : tracker.getHistory()) out.add(toApprovalEntryResponse(e));
    return out;
  }

  // ---------- Project (Create) ----------

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "priceSummary", ignore = true)
  @Mapping(target = "approvals", expression = "java(new ApprovalTracker())")
  @Mapping(target = "status", expression = "java(com.itproject.rcpt.enums.ProjectStatus.DRAFT)")
  @Mapping(target = "ownerUserId", ignore = true)  
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  Project toEntity(ProjectCreateRequest req);

  /**
   * After initial mapping, manually fill the collections for staff/non-staff lists.
   * This ensures they are properly transformed before saving to MongoDB.
   */
  @AfterMapping
  default void fillCollections(ProjectCreateRequest req, @MappingTarget Project p) {
    p.setDetails(toDetails(req.getDetails()));
    p.setStaffCosts(toStaffCostList(req.getStaff()));
    p.setNonStaffCosts(toNonStaffList(req.getNonStaff()));
  }

  // ---------- Project (Update - Partial Merge) ----------

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  default void updateEntity(ProjectUpdateRequest req, @MappingTarget Project p) {
    if (req == null) return;
    if (req.getDetails() != null) p.setDetails(toDetails(req.getDetails()));
    if (req.getStaff() != null) p.setStaffCosts(toStaffCostList(req.getStaff()));
    if (req.getNonStaff() != null) p.setNonStaffCosts(toNonStaffList(req.getNonStaff()));
  }

  // ---------- Project → Response DTO ----------

  @Mapping(target = "id", source = "id")
  @Mapping(target = "details", source = "details")
  @Mapping(target = "staff", expression = "java(toStaffCostResponseList(p.getStaffCosts()))")
  @Mapping(target = "nonStaff", expression = "java(toNonStaffResponseList(p.getNonStaffCosts()))")
  @Mapping(target = "priceSummary", expression = "java(toPriceSummaryResponse(p.getPriceSummary()))")
  @Mapping(target = "approvalsHistory", expression = "java(toApprovalHistoryResponse(p.getApprovals()))")
  ProjectResponse toResponse(Project p);

  // ---------- Price Summary ----------

  default PriceSummaryResponse toPriceSummaryResponse(PriceSummary s) {
    if (s == null) return null;
    var dto = new PriceSummaryResponse();
    dto.setDirectStaffCost(toMoneyDto(s.getDirectStaffCost()));
    dto.setDirectNonStaffCost(toMoneyDto(s.getDirectNonStaffCost()));
    dto.setIndirectCost(toMoneyDto(s.getIndirectCost()));
    dto.setTotalCost(toMoneyDto(s.getTotalCost()));
    dto.setSponsorPrice(toMoneyDto(s.getSponsorPrice()));
    dto.setGst(toMoneyDto(s.getGst()));
    dto.setTotalPriceInclGst(toMoneyDto(s.getTotalPriceInclGst()));
    return dto;
  }

}
