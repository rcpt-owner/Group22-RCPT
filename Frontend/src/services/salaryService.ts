import { apiService } from './api';
import type { YearAllocationDto } from './staffCostService';
import { StaffCategory } from './staffCostService';

// ===== Type Definitions =====

export interface SalaryDto {
  id: number;
  category: string;
  level: number;
  annualSalary: number;
}

// Extended staff cost type for calculations (combines request/response with salary info)
export interface StaffCostWithSalary {
  id?: number;
  projectId: number;
  roleName: string;
  category: string;
  level: number;
  timeBasis: string;
  time: YearAllocationDto[];
  annualSalary?: number;
  totalCost?: number;
}

// ===== API Service Functions =====

export const salaryService = {
  /**
   * Get all salaries from the backend
   */
  async getAllSalaries(): Promise<SalaryDto[]> {
    try {
      return await apiService.get<SalaryDto[]>('api/v1/salaries');
    } catch (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }
  },

  /**
   * Get salary by category and level
   */
  async getSalary(category: string, level: number): Promise<SalaryDto | null> {
    try {
      return await apiService.get<SalaryDto>(`api/v1/salaries/${category}/${level}`);
    } catch (error) {
      console.error(`Error fetching salary for ${category} level ${level}:`, error);
      return null;
    }
  },

  /**
   * Get salary amount by category and level
   */
  async getSalaryAmount(category: string, level: number): Promise<number | null> {
    try {
      const salary = await this.getSalary(category, level);
      return salary?.annualSalary || null;
    } catch (error) {
      console.error(`Error fetching salary amount for ${category} level ${level}:`, error);
      return null;
    }
  },

  /**
   * Create a salary map for fast lookups
   * Use this when you need to look up many salaries without making repeated API calls
   */
  async createSalaryMap(): Promise<Map<string, number>> {
    const salaries = await this.getAllSalaries();
    const map = new Map<string, number>();
    
    salaries.forEach(s => {
      const key = `${s.category}_${s.level}`;
      map.set(key, s.annualSalary);
    });
    
    return map;
  },

  /**
   * Get salary from map (faster than API call)
   */
  getSalaryFromMap(map: Map<string, number>, category: string, level: number): number | null {
    const key = `${category}_${level}`;
    return map.get(key) || null;
  }
};

// ===== Utility Functions =====

export const salaryUtils = {
  /**
   * Calculate FTE from hours per week
   */
  hoursToFTE(hoursPerWeek: number): number {
    return hoursPerWeek / 38; // Assuming 38 hours/week = 1.0 FTE
  },

  /**
   * Calculate hours per week from FTE
   */
  fteToHours(fte: number): number {
    return fte * 38;
  },

  /**
   * Calculate hourly rate from annual salary
   */
  calculateHourlyRate(annualSalary: number): number {
    return annualSalary / 1976; // 38 hours/week × 52 weeks = 1976 hours/year
  },

  /**
   * Format FTE for display
   */
  formatFTE(fte: number): string {
    return `${(fte * 100).toFixed(1)}%`;
  },

  /**
   * Validate FTE value
   */
  validateFTE(fte: number): boolean {
    return fte >= 0 && fte <= 1;
  },

  /**
   * Get level description
   */
  getLevelDescription(category: string, level: number): string {
    const descriptions: Record<string, Record<number, string>> = {
      'ACADEMIC': {
        1: 'Level A - Associate Lecturer',
        2: 'Level B - Lecturer',
        3: 'Level C - Senior Lecturer',
        4: 'Level D - Associate Professor',
        5: 'Level E - Professor'
      },
      'RESEARCH': {
        1: 'Research Assistant',
        2: 'Research Associate',
        3: 'Senior Research Associate',
        4: 'Research Fellow',
        5: 'Senior Research Fellow'
      },
      'PROFESSIONAL': {
        1: 'Professional Officer Level 1',
        2: 'Professional Officer Level 2',
        3: 'Professional Officer Level 3',
        4: 'Professional Officer Level 4',
        5: 'Professional Officer Level 5',
        6: 'Professional Officer Level 6'
      },
      'TECHNICAL': {
        1: 'Technical Officer Level 1',
        2: 'Technical Officer Level 2',
        3: 'Technical Officer Level 3',
        4: 'Technical Officer Level 4',
        5: 'Senior Technical Officer'
      }
    };

    return descriptions[category]?.[level] || `${category} Level ${level}`;
  },

  /**
   * Get all valid levels for a category
   */
  getValidLevelsForCategory(category: string): number[] {
    const levels: Record<string, number[]> = {
      'ACADEMIC': [1, 2, 3, 4, 5],
      'RESEARCH': [1, 2, 3, 4, 5],
      'PROFESSIONAL': [1, 2, 3, 4, 5, 6],
      'TECHNICAL': [1, 2, 3, 4, 5]
    };

    return levels[category] || [];
  },

  /**
   * Get all valid categories
   */
  getValidCategories(): string[] {
    return ['ACADEMIC', 'RESEARCH', 'PROFESSIONAL', 'TECHNICAL'];
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Calculate total cost for a staff member based on time allocations
   * Uses YearAllocationDto.value (compatible with staffCostService)
   */
  calculateStaffCost(
    annualSalary: number,
    fte: number,
    yearAllocations: YearAllocationDto[]
  ): number {
    let totalCost = 0;
    
    yearAllocations.forEach(allocation => {
      // allocation.value represents the time portion for that year
      totalCost += annualSalary * fte * allocation.value;
    });
    
    return totalCost;
  },

  /**
   * Calculate total time from year allocations
   * Uses YearAllocationDto.value (compatible with staffCostService)
   */
  calculateTotalTime(yearAllocations: YearAllocationDto[]): number {
    return yearAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
  },

  /**
   * Validate staff cost data for calculations
   */
  validateStaffCostData(
    roleName: string,
    category: string,
    level: number,
    timeBasis: string,
    time: number,
    yearAllocations: YearAllocationDto[]
  ): string[] {
    const errors: string[] = [];

    if (!roleName || roleName.trim() === '') {
      errors.push('Role name is required');
    }

    if (!category) {
      errors.push('Category is required');
    } else if (!this.getValidCategories().includes(category)) {
      errors.push('Invalid category');
    }

    if (level === undefined || level === null) {
      errors.push('Level is required');
    } else if (category) {
      const validLevels = this.getValidLevelsForCategory(category);
      if (!validLevels.includes(level)) {
        errors.push(`Invalid level for ${category}. Valid levels: ${validLevels.join(', ')}`);
      }
    }

    if (!timeBasis) {
      errors.push('Time basis is required');
    }

    if (time === undefined || time === null) {
      errors.push('Time is required');
    } else if (time <= 0) {
      errors.push('Time must be greater than 0');
    } else if (timeBasis === 'FTE' && time > 1) {
      errors.push('FTE cannot exceed 1.0');
    }

    if (!yearAllocations || yearAllocations.length === 0) {
      errors.push('At least one year allocation is required');
    } else {
      yearAllocations.forEach((allocation, index) => {
        if (allocation.value <= 0 || allocation.value > 1) {
          errors.push(`Year allocation ${index + 1} value must be between 0 and 1`);
        }
      });
    }

    return errors;
  },

  /**
   * Convert hours per week to FTE for staff cost
   */
  convertToFTE(time: number, timeBasis: string): number {
    if (timeBasis === 'FTE') {
      return time;
    } else if (timeBasis === 'HOURS_PER_WEEK') {
      return this.hoursToFTE(time);
    }
    return 0;
  },

  /**
   * Enrich staff cost with salary information
   * Useful when you have staffCostService data and want to add salary calculations
   */
  async enrichWithSalary(
    staffCost: {
      roleName: string;
      category: string;
      level?: number;
      timeBasis: string;
      time: YearAllocationDto[];
    },
    salaryMap?: Map<string, number>
  ): Promise<StaffCostWithSalary | null> {
    if (!staffCost.level) {
      return null;
    }

    let annualSalary: number | null;

    if (salaryMap) {
      annualSalary = salaryService.getSalaryFromMap(salaryMap, staffCost.category, staffCost.level);
    } else {
      annualSalary = await salaryService.getSalaryAmount(staffCost.category, staffCost.level);
    }

    if (!annualSalary) {
      return null;
    }

    // Calculate FTE (assuming time array contains FTE values directly)
    const totalFTE = this.calculateTotalTime(staffCost.time);
    const totalCost = this.calculateStaffCost(annualSalary, totalFTE, staffCost.time);

    return {
      projectId: 0, // This would need to be provided
      roleName: staffCost.roleName,
      category: staffCost.category,
      level: staffCost.level,
      timeBasis: staffCost.timeBasis,
      time: staffCost.time,
      annualSalary,
      totalCost
    };
  },

  /**
   * Get category from StaffCategory enum value
   */
  getCategoryFromEnum(category: StaffCategory): string {
    return category.toString();
  }
};

export default salaryService;
