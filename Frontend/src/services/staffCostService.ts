// services/staffCostService.ts
// Staff cost management service connected to Spring Boot backend

import { apiService } from './api';

// ==================== Types ====================

// Year allocation DTO matching Java backend
export interface YearAllocationDto {
  year: number;
  value: number;
}

export interface StaffCostRequest {
  roleName: string;
  employmentType: EmploymentType;
  category: StaffCategory;
  timeBasis: string;
  time: YearAllocationDto[];
  inKind: boolean;
  notes: string;
}

export interface StaffCostResponse {
  roleName: string;
  employmentType: EmploymentType;
  category: StaffCategory;
  timeBasis: string;
  time: YearAllocationDto[];
  inKind: boolean;
  notes: string;
}

export enum StaffCategory {
  ACADEMIC = 'ACADEMIC',
  RESEARCH = 'RESEARCH',
  PROFESSIONAL = 'PROFESSIONAL',
  TECHNICAL = 'TECHNICAL',
  CASUAL = 'CASUAL',
  OTHER = 'OTHER'
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CASUAL = 'CASUAL',
  CONTRACT = 'CONTRACT',
  FIXED_TERM = 'FIXED_TERM'
}

// ==================== Service Implementation ====================

export const staffCostService = {
  /**
   * List all staff costs for a project
   */
  async list(projectId: string): Promise<StaffCostResponse[]> {
    return apiService.get<StaffCostResponse[]>(`api/v1/projects/${projectId}/staff`);
  },

  /**
   * Replace all staff costs for a project (bulk update)
   */
  async replaceAll(projectId: string, staffCosts: StaffCostRequest[]): Promise<StaffCostResponse[]> {
    return apiService.post<StaffCostResponse[]>(
      `api/v1/projects/${projectId}/staff`,
      staffCosts
    );
  },

  /**
   * Append a single staff cost to the project
   */
  async append(projectId: string, staffCost: StaffCostRequest): Promise<StaffCostResponse> {
    return apiService.post<StaffCostResponse>(
      `api/v1/projects/${projectId}/staff/append`,
      staffCost
    );
  },

  /**
   * Delete a staff cost by index
   */
  async deleteAt(projectId: string, index: number): Promise<void> {
    return apiService.delete(`api/v1/projects/${projectId}/staff/${index}`);
  },

  // ===== Helper Methods =====

  /**
   * Update a single staff cost at index (replaces entire list)
   */
  async updateAt(projectId: string, index: number, staffCost: StaffCostRequest): Promise<StaffCostResponse[]> {
    // Get current list
    const currentList = await this.list(projectId);

    // Update the item at index
    const updatedList = [...currentList];
    if (index >= 0 && index < updatedList.length) {
      updatedList[index] = {
        ...updatedList[index],
        ...staffCost
      };
    }

    // Replace entire list with updated version
    return this.replaceAll(projectId, updatedList);
  },

  /**
   * Add multiple staff costs at once
   */
  async appendMultiple(projectId: string, staffCosts: StaffCostRequest[]): Promise<StaffCostResponse[]> {
    const results: StaffCostResponse[] = [];

    for (const staffCost of staffCosts) {
      const result = await this.append(projectId, staffCost);
      results.push(result);
    }

    return results;
  },

  /**
   * Clear all staff costs for a project
   */
  async clearAll(projectId: string): Promise<StaffCostResponse[]> {
    return this.replaceAll(projectId, []);
  },

  /**
   * Calculate total time allocation for a staff cost
   */
  calculateTotalTime(staffCost: StaffCostResponse): number {
    return staffCost.time.reduce((total, yearAlloc) => total + yearAlloc.value, 0);
  },

  /**
   * Get staff costs by category
   */
  async getByCategory(projectId: string, category: StaffCategory): Promise<StaffCostResponse[]> {
    const allCosts = await this.list(projectId);
    return allCosts.filter(cost => cost.category === category);
  },

  /**
   * Get staff costs by employment type
   */
  async getByEmploymentType(projectId: string, employmentType: EmploymentType): Promise<StaffCostResponse[]> {
    const allCosts = await this.list(projectId);
    return allCosts.filter(cost => cost.employmentType === employmentType);
  },

  /**
   * Create a default staff cost template
   */
  createTemplate(): StaffCostRequest {
    return {
      roleName: '',
      category: StaffCategory.ACADEMIC,
      employmentType: EmploymentType.FULL_TIME,
      timeBasis: 'FTE',
      time: [],
      inKind: false,
      notes: ''
    };
  },

  /**
   * Validate staff cost data
   */
  validate(staffCost: StaffCostRequest): string[] {
    const errors: string[] = [];

    if (!staffCost.roleName || staffCost.roleName.trim() === '') {
      errors.push('Role name is required');
    }

    if (!staffCost.category) {
      errors.push('Staff category is required');
    }

    if (!staffCost.employmentType) {
      errors.push('Employment type is required');
    }

    if (!staffCost.timeBasis || staffCost.timeBasis.trim() === '') {
      errors.push('Time basis is required');
    }

    if (!Array.isArray(staffCost.time) || staffCost.time.length === 0) {
      errors.push('At least one time allocation is required');
    }

    // Validate year allocations
    if (Array.isArray(staffCost.time)) {
      staffCost.time.forEach((yearAlloc, index) => {
        if (typeof yearAlloc.year !== 'number' || yearAlloc.year < 2000 || yearAlloc.year > 2100) {
          errors.push(`Invalid year at position ${index + 1}`);
        }
        if (typeof yearAlloc.value !== 'number' || yearAlloc.value < 0) {
          errors.push(`Invalid value at position ${index + 1}`);
        }
      });
    }

    return errors;
  },

  /**
   * Group staff costs by category
   */
  async groupByCategory(projectId: string): Promise<Record<string, StaffCostResponse[]>> {
    const staffCosts = await this.list(projectId);

    return staffCosts.reduce((groups, cost) => {
      const category = cost.category || 'OTHER';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(cost);
      return groups;
    }, {} as Record<string, StaffCostResponse[]>);
  },

  /**
   * Convert years Record to YearAllocationDto array
   */
  yearsToTimeArray(years: Record<string, number>): YearAllocationDto[] {
    return Object.entries(years).map(([year, value]) => ({
      year: parseInt(year, 10),
      value
    }));
  },

  /**
   * Convert YearAllocationDto array to years Record
   */
  timeArrayToYears(time: YearAllocationDto[]): Record<string, number> {
    return time.reduce((acc, item) => {
      acc[item.year.toString()] = item.value;
      return acc;
    }, {} as Record<string, number>);
  }
};

// ===== Utility Functions =====

export const staffCostUtils = {
  /**
   * Format staff cost for display
   */
  formatDisplay(staffCost: StaffCostResponse): string {
    const parts = [staffCost.roleName];

    if (staffCost.timeBasis) {
      parts.push(staffCost.timeBasis);
    }

    if (staffCost.category) {
      parts.push(this.getCategoryLabel(staffCost.category));
    }

    return parts.join(' - ');
  },

  /**
   * Get category label
   */
  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      [StaffCategory.ACADEMIC]: 'Academic Staff',
      [StaffCategory.RESEARCH]: 'Research Staff',
      [StaffCategory.PROFESSIONAL]: 'Professional Staff',
      [StaffCategory.TECHNICAL]: 'Technical Staff',
      [StaffCategory.CASUAL]: 'Casual Staff',
      [StaffCategory.OTHER]: 'Other Staff',
    };

    return labels[category] || category;
  },

  /**
   * Get employment type label
   */
  getEmploymentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      [EmploymentType.FULL_TIME]: 'Full Time',
      [EmploymentType.PART_TIME]: 'Part Time',
      [EmploymentType.CASUAL]: 'Casual',
      [EmploymentType.CONTRACT]: 'Contract',
      [EmploymentType.FIXED_TERM]: 'Fixed Term',
    };

    return labels[type] || type;
  },

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'AUD'): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  /**
   * Calculate total allocation across all years
   */
  getTotalAllocation(time: YearAllocationDto[]): number {
    return time.reduce((sum, item) => sum + item.value, 0);
  }
};

export default staffCostService;
