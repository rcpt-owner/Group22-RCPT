package com.itproject.rcpt.service;

import com.itproject.rcpt.domain.Project;
import com.itproject.rcpt.domain.ProjectDetails;
import com.itproject.rcpt.domain.StaffCost;
import com.itproject.rcpt.domain.NonStaffCost;
import com.itproject.rcpt.domain.PriceSummary;
import com.itproject.rcpt.domain.ApprovalTracker;
import com.itproject.rcpt.domain.ApprovalEntry;
import com.itproject.rcpt.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.List;
import java.util.Locale;

@Service
public class ProjectExportService {

    private final ProjectRepository projectRepository;

    public ProjectExportService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Export a project to PDF bytes. This implementation only calls getters that exist
     * in your model classes (Project, ProjectDetails, StaffCost, NonStaffCost, PriceSummary,
     * ApprovalTracker, ApprovalEntry).
     */
    public byte[] exportProjectToPdf(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 50, 50);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            document.add(new Paragraph("Project Export", titleFont));
            document.add(new Paragraph(" "));

            // Project details (use ProjectDetails getters)
            ProjectDetails details = project.getDetails();
            if (details != null) {
                document.add(new Paragraph("Title: " + safe(details.getTitle())));
                // only print fields that likely exist on ProjectDetails — adjust if names differ
                document.add(new Paragraph("Funder: " + safe(details.getFunder())));
                document.add(new Paragraph("Department: " + safe(details.getDepartment())));
                document.add(new Paragraph("Currency: " + safe(details.getCurrency())));
                document.add(new Paragraph("Reference Code: " + safe(details.getReferenceCode())));
                document.add(new Paragraph("Start Date: " + formatDate(details.getStartDate())));
                document.add(new Paragraph("End Date: " + formatDate(details.getEndDate())));
                document.add(new Paragraph(" "));
            }

            // Basic project metadata
            document.add(new Paragraph("Status: " + safe(project.getStatus())));
            document.add(new Paragraph("Owner: " + safe(project.getOwnerUserId())));
            document.add(new Paragraph("Created: " + formatInstant(project.getCreatedAt())));
            document.add(new Paragraph("Updated: " + formatInstant(project.getUpdatedAt())));
            document.add(new Paragraph(" "));

            // Staff costs table (Role, Unit Cost, Units, In-Kind, Notes)
            document.add(new Paragraph("Staff Costs", new Font(Font.HELVETICA, 14, Font.BOLD)));
            PdfPTable staffTable = new PdfPTable(5);
            staffTable.setWidthPercentage(100);
            staffTable.addCell("Role");
            staffTable.addCell("Unit Cost");
            staffTable.addCell("Units");
            staffTable.addCell("In Kind");
            staffTable.addCell("Notes");

            List<StaffCost> staffCosts = project.getStaffCosts();
            if (staffCosts != null && !staffCosts.isEmpty()) {
                for (StaffCost s : staffCosts) {
                    staffTable.addCell(safe(s.getRole()));
                    staffTable.addCell(safeMoney(s.getUnitCost()));
                    staffTable.addCell(s.getUnits() != null ? s.getUnits().toString() : "—");
                    staffTable.addCell(Boolean.toString(s.isInKind()));
                    staffTable.addCell(safe(s.getNotes()));
                }
            } else {
                addEmptyRow(staffTable, 5);
            }
            document.add(staffTable);
            document.add(new Paragraph(" "));

            // Non-staff costs table (CategoryCode, ExpenseTypeCode, Description, Unit Cost, Units)
            document.add(new Paragraph("Non-Staff Costs", new Font(Font.HELVETICA, 14, Font.BOLD)));
            PdfPTable nonStaffTable = new PdfPTable(5);
            nonStaffTable.setWidthPercentage(100);
            nonStaffTable.addCell("Category Code");
            nonStaffTable.addCell("Expense Type Code");
            nonStaffTable.addCell("Description");
            nonStaffTable.addCell("Unit Cost");
            nonStaffTable.addCell("Units");

            List<NonStaffCost> nonStaffCosts = project.getNonStaffCosts();
            if (nonStaffCosts != null && !nonStaffCosts.isEmpty()) {
                for (NonStaffCost n : nonStaffCosts) {
                    nonStaffTable.addCell(safe(n.getCategoryCode()));
                    nonStaffTable.addCell(safe(n.getExpenseTypeCode()));
                    nonStaffTable.addCell(safe(n.getDescription()));
                    nonStaffTable.addCell(safeMoney(n.getUnitCost()));
                    nonStaffTable.addCell(n.getUnits() != null ? n.getUnits().toString() : "—");
                }
            } else {
                addEmptyRow(nonStaffTable, 5);
            }
            document.add(nonStaffTable);
            document.add(new Paragraph(" "));

            // Price Summary: use Money.toString() (safe) for money values
            PriceSummary ps = project.getPriceSummary();
            if (ps != null) {
                document.add(new Paragraph("Price Summary", new Font(Font.HELVETICA, 14, Font.BOLD)));
                document.add(new Paragraph("Direct Staff Cost: " + safeMoney(ps.getDirectStaffCost())));
                document.add(new Paragraph("Direct Non-Staff Cost: " + safeMoney(ps.getDirectNonStaffCost())));
                document.add(new Paragraph("Indirect Cost: " + safeMoney(ps.getIndirectCost())));
                document.add(new Paragraph("Total Cost: " + safeMoney(ps.getTotalCost())));
                document.add(new Paragraph("Sponsor Price: " + safeMoney(ps.getSponsorPrice())));
                document.add(new Paragraph("GST: " + safeMoney(ps.getGst())));
                document.add(new Paragraph("Total Price incl GST: " + safeMoney(ps.getTotalPriceInclGst())));
                document.add(new Paragraph(" "));
            }

            // Approvals: ApprovalTracker.getHistory() -> List<ApprovalEntry>
            document.add(new Paragraph("Approval History", new Font(Font.HELVETICA, 14, Font.BOLD)));
            ApprovalTracker tracker = project.getApprovals();
            if (tracker != null && tracker.getHistory() != null && !tracker.getHistory().isEmpty()) {
                PdfPTable approvalsTable = new PdfPTable(4);
                approvalsTable.setWidthPercentage(100);
                approvalsTable.addCell("Action");
                approvalsTable.addCell("Actor");
                approvalsTable.addCell("Comment");
                approvalsTable.addCell("Timestamp");

                for (ApprovalEntry entry : tracker.getHistory()) {
                    approvalsTable.addCell(safe(entry.getAction()));
                    approvalsTable.addCell(safe(entry.getActorUserId()));
                    approvalsTable.addCell(safe(entry.getComment()));
                    approvalsTable.addCell(formatInstant(entry.getAt()));
                }
                document.add(approvalsTable);
            } else {
                document.add(new Paragraph("No approval entries found."));
            }

            document.close();
            return out.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF document", e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error while generating PDF", e);
        }
    }

    // --- Helpers ---

    /** Null-safe string conversion for arbitrary objects. */
    private String safe(Object val) {
        return val == null ? "—" : val.toString();
    }

    /**
     * Format Money for display. We call toString() on the money object to avoid
     * depending on specific Money getters that may not exist. If you want
     * currency+amount formatting, update this to call Money.getAmount()/getCurrency()
     * if those accessors exist in your Money class.
     */
    private String safeMoney(Object money) {
        return money == null ? "—" : money.toString();
    }

    private String formatDate(Object dateObj) {
        if (dateObj == null) return "—";

        DateTimeFormatter dateFormatter =
                DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM).withLocale(Locale.getDefault());

        if (dateObj instanceof LocalDate localDate) {
            return localDate.format(dateFormatter);
        } else if (dateObj instanceof Instant instant) {
            return instant.atZone(ZoneId.systemDefault()).toLocalDate().format(dateFormatter);
        } else {
            return dateObj.toString();
        }
    }

    private String formatInstant(java.time.Instant instant) {
        if (instant == null) return "—";
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }

    private void addEmptyRow(PdfPTable table, int columns) {
        for (int i = 0; i < columns; i++) table.addCell("—");
    }
}
