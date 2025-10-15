package com.uom.rcpt.mapper;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.uom.rcpt.domain.*;
import com.uom.rcpt.domain.value.Money;
import com.uom.rcpt.domain.value.YearAllocation;
import com.uom.rcpt.dto.common.MoneyDto;
import com.uom.rcpt.dto.common.YearAllocationDto;
import com.uom.rcpt.dto.nonstaff.NonStaffCostRequest;
import com.uom.rcpt.dto.nonstaff.NonStaffCostResponse;
import com.uom.rcpt.dto.price.PriceSummaryResponse;
import com.uom.rcpt.dto.project.*;
import com.uom.rcpt.dto.staff.StaffCostRequest;
import com.uom.rcpt.dto.staff.StaffCostResponse;
import com.uom.rcpt.enums.CostCategory;
import com.uom.rcpt.enums.ExpenseType;

@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProjectMapper {

  // --------- Money / YearAllocation ----------
  default Money toMoney(MoneyDto dto) {
    if (dto == null) return null;
    var m = new Money();
    m.setAmount(dto.getAmount());
    m.setCurrency(dto.getCurrency());
    return m;
  }
  default MoneyDto toMoneyDto(Money m) {
    if (m == null) return null;
    var dto = new MoneyDto();
    dto.setAmount(m.getAmount());
    dto.setCurrency(m.getCurrency());
    return dto;
  }
  default YearAllocation toYearAllocation(YearAllocationDto dto) {
    if (dto == null) return null;
    var ya = new YearAllocation();
    ya.setYear(dto.getYear() == null ? 0 : dto.getYear());
    ya.setValue(dto.getValue());
    return ya;
  }
  default YearAllocationDto toYearAllocationDto(YearAllocation ya) {
    if (ya == null) return null;
    var dto = new YearAllocationDto();
    dto.setYear(ya.getYear());
    dto.setValue(ya.getValue());
    return dto;
  }

  // --------- Details ----------
  ProjectDetails toDetails(ProjectDetailsDto dto);
  ProjectDetailsDto toDetailsDto(ProjectDetails d);

  // --------- Staff ----------
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

  // --------- Non-staff (codes <-> enums) ----------
  default NonStaffCost toNonStaff(NonStaffCostRequest req) {
    if (req == null) return null;
    var n = new NonStaffCost();
    if (req.getCategoryCode() != null)
      n.setCategory(CostCategory.fromCode(req.getCategoryCode()));
    if (req.getExpenseTypeCode() != null)
      n.setExpenseType(ExpenseType.fromCode(req.getExpenseTypeCode()));
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

  default NonStaffCostResponse toNonStaffResponse(NonStaffCost n) {
    if (n == null) return null;
    var dto = new NonStaffCostResponse();
    if (n.getCategory() != null) {
      dto.setCategoryCode(n.getCategory().getCode());
      dto.setCategoryLabel(n.getCategory().getLabel());
    }
    if (n.getExpenseType() != null) {
      dto.setExpenseTypeCode(n.getExpenseType().getCode());
      dto.setExpenseTypeLabel(n.getExpenseType().getLabel());
    }
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

  // --------- Approval history ----------
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

  // --------- Project (create) ----------
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "priceSummary", ignore = true)
  @Mapping(target = "approvals", expression = "java(new ApprovalTracker())")
  @Mapping(target = "status", expression = "java(com.uom.rcpt.enums.ProjectStatus.DRAFT)")
  @Mapping(target = "ownerUserId", ignore = true) // set in service
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "version", ignore = true)
  Project toEntity(ProjectCreateRequest req);

  // Manual bridge to lists inside Project
  @AfterMapping
  default void fillCollections(ProjectCreateRequest req, @MappingTarget Project p) {
    p.setDetails(toDetails(req.getDetails()));
    p.setStaffCosts(toStaffCostList(req.getStaff()));
    p.setNonStaffCosts(toNonStaffList(req.getNonStaff()));
  }

  // --------- Project (update merge) ----------
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  default void updateEntity(ProjectUpdateRequest req, @MappingTarget Project p) {
    if (req == null) return;
    if (req.getDetails() != null) p.setDetails(toDetails(req.getDetails()));
    if (req.getStaff() != null) p.setStaffCosts(toStaffCostList(req.getStaff()));
    if (req.getNonStaff() != null) p.setNonStaffCosts(toNonStaffList(req.getNonStaff()));
  }

  // --------- Project -> Response ----------
  @Mapping(target = "id", source = "id")
  @Mapping(target = "details", source = "details")
  @Mapping(target = "staff", expression = "java(toStaffCostResponseList(p.getStaffCosts()))")
  @Mapping(target = "nonStaff", expression = "java(toNonStaffResponseList(p.getNonStaffCosts()))")
  @Mapping(target = "priceSummary", expression = "java(toPriceSummaryResponse(p.getPriceSummary()))")
  @Mapping(target = "approvalsHistory", expression = "java(toApprovalHistoryResponse(p.getApprovals()))")
  ProjectResponse toResponse(Project p);

  // PriceSummary -> DTO
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

  // Details mapping
  default ProjectDetailsDto toDetailsDtoSafe(ProjectDetails d) { return toDetailsDto(d); }
}
