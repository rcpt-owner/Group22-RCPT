// services/projectService.ts
// Project service connected to Spring Boot backend

import { apiService, withUserId } from './api';
import type { StaffCost, NonStaffCost } from '@/features/RCPT/rcptEngine';

// ==================== Types ====================

export interface Project {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  ownerUserId: string;
  status: ProjectStatus;
  details?: ProjectDetails;
  staffCosts: StaffCost[];
  nonStaffCosts: NonStaffCost[];
  priceSummary?: PriceSummary;
  createdDate: string;
  updatedDate: string;
  deletedDate?: string;
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ProjectDetails {
  startDate?: string;
  endDate?: string;
  fundingBody?: string;
  scheme?: string;
  researchClassification?: string;
}

export interface PriceSummary {
  totalStaffCost?: { amount: number; currency: string };
  totalNonStaffCost?: { amount: number; currency: string };
  totalDirectCost?: { amount: number; currency: string };
  indirectCostRate?: number;
  totalIndirectCost?: { amount: number; currency: string };
  totalCost?: { amount: number; currency: string };
  marginRate?: number;
  totalMargin?: { amount: number; currency: string };
  totalPrice?: { amount: number; currency: string };
}

// DTOs for API requests
export interface ProjectCreateRequest {
  title: string;
  description?: string;
  details?: ProjectDetails;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  details?: ProjectDetails;
}

// Legacy types (keeping for compatibility)
export interface ProjectOverview {
  projectId: string;
  title: string;
  summary: string;
  budget: number;
  status: string;
  lastUpdated: string;
}

export interface ProjectCostData {
  projectId: string;
  staff: Array<{ role: string; fte: number; cost: number }>;
  overheadRate: number;
  totalDirect: number;
  totalIndirect: number;
  total: number;
}

export interface ProjectOverviewFormData {
  title: string;
  description?: string;
  funder?: string;
  department?: string;
  startDate: string;
  endDate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================== Service Implementation ====================

const BASE_PATH = 'api/v1/projects';

// Temporary default user ID until auth is implemented
const DEFAULT_USER_ID = 'dev-user-001';

export const projectService = {
  // ===== CRUD Operations (Connected to Backend) =====

  /**
   * Create a new project
   */
  async create(data: ProjectCreateRequest, userId: string = DEFAULT_USER_ID): Promise<Project> {
    return apiService.post<Project>(BASE_PATH, data, withUserId(userId));
  },

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project> {
    return apiService.get<Project>(`${BASE_PATH}/${id}`);
  },

  /**
   * List projects with pagination and filters
   */
  async list(params?: {
    page?: number;
    size?: number;
    ownerUserId?: string;
    status?: ProjectStatus;
  }): Promise<PageResponse<Project>> {
    const { page = 0, size = 10, ...filters } = params || {};
    return apiService.get<PageResponse<Project>>(BASE_PATH, { page, size, ...filters });
  },

  /**
   * Update project
   */
  async update(id: string, data: ProjectUpdateRequest): Promise<Project> {
    return apiService.put<Project>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Delete project
   */
  async delete(id: string): Promise<void> {
    return apiService.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Export project to PDF
   */
  async exportPdf(id: string): Promise<void> {
    return apiService.download(`${BASE_PATH}/${id}/export`, `project_${id}.pdf`);
  },

  // ===== Legacy Methods (Updated to use Backend) =====

  async getProjectOverview(projectId: string): Promise<ProjectOverview> {
    const project = await this.getById(projectId);

    // Transform backend response to legacy format
    return {
      projectId: project.id,
      title: project.title,
      summary: project.description || '',
      budget: project.priceSummary?.totalCost?.amount || 0,
      status: project.status,
      lastUpdated: project.updatedDate
    };
  },

  async getCostData(projectId: string): Promise<ProjectCostData> {
    const project = await this.getById(projectId);

    // Transform staff costs to legacy format
    const staff = project.staffCosts.map(sc => ({
      role: sc.role || 'Unknown Role',
      fte: 1, // FTE calculation would need to be based on years data
      cost: Object.values(sc.years || {}).reduce((sum, val) => sum + val, 0)
    }));

    const totalDirect = project.priceSummary?.totalDirectCost?.amount || 0;
    const totalIndirect = project.priceSummary?.totalIndirectCost?.amount || 0;

    return {
      projectId: project.id,
      staff,
      overheadRate: project.priceSummary?.indirectCostRate || 0,
      totalDirect,
      totalIndirect,
      total: totalDirect + totalIndirect
    };
  },

  async getStaffCosts(projectId: string): Promise<StaffCost[]> {
    const project = await this.getById(projectId);
    return project.staffCosts;
  },

  async getNonStaffCosts(projectId: string): Promise<NonStaffCost[]> {
    const project = await this.getById(projectId);
    return project.nonStaffCosts;
  },

  async submitReview(projectId: string): Promise<any> {
    // Update project status to IN_REVIEW
    const updated = await this.update(projectId, { status: ProjectStatus.IN_REVIEW });
    return {
      projectId: updated.id,
      submittedAt: updated.updatedDate,
      status: updated.status
    };
  },

  async updateProjectOverview(projectId: string, payload: ProjectOverviewFormData): Promise<any> {
    const updateData: ProjectUpdateRequest = {
      title: payload.title,
      description: payload.description,
      details: {
        startDate: payload.startDate,
        endDate: payload.endDate,
        fundingBody: payload.funder,
        scheme: payload.department
      }
    };

    const updated = await this.update(projectId, updateData);

    return {
      projectId: updated.id,
      savedAt: updated.updatedDate,
      status: 'OK',
      payload
    };
  },

  // ===== Helper Methods =====

  /**
   * Get projects for current user
   */
  async getUserProjects(userId: string = DEFAULT_USER_ID): Promise<Project[]> {
    const response = await this.list({ ownerUserId: userId, size: 100 });
    return response.content;
  },

  /**
   * Get recent projects (last 5)
   */
  async getRecentProjects(userId: string = DEFAULT_USER_ID): Promise<Project[]> {
    const response = await this.list({ ownerUserId: userId, size: 5 });
    return response.content;
  },

  /**
   * Search projects by title
   */
  async searchByTitle(query: string, userId?: string): Promise<Project[]> {
    // This would need a search endpoint in backend
    // For now, fetch all and filter client-side
    const response = await this.list({ ownerUserId: userId, size: 100 });
    return response.content.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  },

  /**
   * Get project statistics
   */
  async getStatistics(userId: string = DEFAULT_USER_ID): Promise<{
    total: number;
    byStatus: Record<ProjectStatus, number>;
  }> {
    const response = await this.list({ ownerUserId: userId, size: 1000 });
    const projects = response.content;

    const byStatus = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<ProjectStatus, number>);

    return {
      total: projects.length,
      byStatus
    };
  }
};

// Export the service as default for backward compatibility
export default projectService;