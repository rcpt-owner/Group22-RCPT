import { apiService } from './api';

// ===== Type Definitions =====

/**
 * Salary Rate Multiplier - matches SalaryRateMultiplier.java entity
 */
export interface SalaryRateMultiplier {
  unit: string;           // Classification code (e.g., "UOM-ACAD-3.4", "HEW-6")
  multiplier: number;     // Rate multiplier value
}

/**
 * Request for creating/updating a salary rate multiplier
 */
export interface SalaryRateMultiplierRequest {
  unit: string;
  multiplier: number;
}

// ===== API Service Functions =====

export const salaryRateMultiplierService = {
  /**
   * Get all salary rate multipliers from the backend
   */
  async getAll(): Promise<SalaryRateMultiplier[]> {
    try {
      return await apiService.get<SalaryRateMultiplier[]>('/api/salary-rate-multipliers');
    } catch (error) {
      console.error('Error fetching salary rate multipliers:', error);
      throw error;
    }
  },

  /**
   * Get salary rate multiplier by unit/classification code
   */
  async getByUnit(unit: string): Promise<SalaryRateMultiplier> {
    try {
      return await apiService.get<SalaryRateMultiplier>(`/api/salary-rate-multipliers/${unit}`);
    } catch (error) {
      console.error(`Error fetching salary rate multiplier for unit ${unit}:`, error);
      throw error;
    }
  },

  /**
   * Get multiplier value by unit/classification code
   */
  async getMultiplierValue(unit: string): Promise<number | null> {
    try {
      const result = await this.getByUnit(unit);
      return result.multiplier;
    } catch (error) {
      console.error(`Error fetching multiplier value for unit ${unit}:`, error);
      return null;
    }
  },

  /**
   * Create or update a salary rate multiplier
   */
  async createOrUpdate(data: SalaryRateMultiplierRequest): Promise<SalaryRateMultiplier> {
    try {
      return await apiService.post<SalaryRateMultiplier>('/api/salary-rate-multipliers', data);
    } catch (error) {
      console.error('Error creating/updating salary rate multiplier:', error);
      throw error;
    }
  },

  /**
   * Delete a salary rate multiplier by unit
   */
  async delete(unit: string): Promise<void> {
    try {
      return await apiService.delete(`/api/salary-rate-multipliers/${unit}`);
    } catch (error) {
      console.error(`Error deleting salary rate multiplier for unit ${unit}:`, error);
      throw error;
    }
  },

  /**
   * Create a multiplier map for fast lookups
   * Use this when you need to look up many multipliers without making repeated API calls
   */
  async createMultiplierMap(): Promise<Map<string, number>> {
    const multipliers = await this.getAll();
    const map = new Map<string, number>();
    
    multipliers.forEach(m => {
      map.set(m.unit, m.multiplier);
    });
    
    return map;
  },

  /**
   * Get multiplier from map (faster than API call)
   */
  getMultiplierFromMap(map: Map<string, number>, unit: string): number | null {
    return map.get(unit) || null;
  },

  /**
   * Batch create or update multiple multipliers
   */
  async createOrUpdateMultiple(multipliers: SalaryRateMultiplierRequest[]): Promise<SalaryRateMultiplier[]> {
    const results: SalaryRateMultiplier[] = [];
    
    for (const multiplier of multipliers) {
      const result = await this.createOrUpdate(multiplier);
      results.push(result);
    }
    
    return results;
  }
};

// ===== Classification Code Utilities =====

export const classificationUtils = {
  /**
   * Parse UoM classification code
   * Examples: "UOM-ACAD-3.4" → {prefix: "UOM", category: "ACAD", level: 3, step: 4}
   *           "HEW-6" → {prefix: "HEW", category: null, level: 6, step: null}
   */
  parseClassificationCode(code: string): {
    prefix: string | null;
    category: string | null;
    level: number | null;
    step: number | null;
  } {
    // Try UOM format: "UOM-ACAD-3.4"
    const uomMatch = code.match(/^([A-Z]+)-([A-Z]+)-(\d+)\.(\d+)$/);
    if (uomMatch) {
      return {
        prefix: uomMatch[1] || null,
        category: uomMatch[2] || null,
        level: parseInt(uomMatch[3] || '0', 10),
        step: parseInt(uomMatch[4] || '0', 10)
      };
    }

    // Try HEW format: "HEW-6"
    const hewMatch = code.match(/^([A-Z]+)-(\d+)$/);
    if (hewMatch) {
      return {
        prefix: hewMatch[1] || null,
        category: null,
        level: parseInt(hewMatch[2] || '0', 10),
        step: null
      };
    }

    // Try simple level: "LEVEL-3"
    const levelMatch = code.match(/^([A-Z]+)-(\d+)$/);
    if (levelMatch) {
      return {
        prefix: levelMatch[1] || null,
        category: null,
        level: parseInt(levelMatch[2] || '0', 10),
        step: null
      };
    }

    return {
      prefix: null,
      category: null,
      level: null,
      step: null
    };
  },

  /**
   * Build UoM classification code from components
   */
  buildClassificationCode(category: string, level: number, step?: number): string {
    if (step !== undefined && step !== null) {
      return `UOM-${category}-${level}.${step}`;
    }
    return `${category}-${level}`;
  },

  /**
   * Get category label from code
   */
  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'ACAD': 'Academic',
      'ACADEMIC': 'Academic',
      'RES': 'Research',
      'RESEARCH': 'Research',
      'PROF': 'Professional',
      'PROFESSIONAL': 'Professional',
      'TECH': 'Technical',
      'TECHNICAL': 'Technical',
      'HEW': 'Higher Education Worker',
      'CASUAL': 'Casual'
    };

    return labels[category] || category;
  },

  /**
   * Get level description for UoM classifications
   */
  getLevelDescription(category: string, level: number): string {
    const descriptions: Record<string, Record<number, string>> = {
      'ACAD': {
        1: 'Level A - Associate Lecturer',
        2: 'Level B - Lecturer', 
        3: 'Level C - Senior Lecturer',
        4: 'Level D - Associate Professor',
        5: 'Level E - Professor'
      },
      'ACADEMIC': {
        1: 'Level A - Associate Lecturer',
        2: 'Level B - Lecturer',
        3: 'Level C - Senior Lecturer',
        4: 'Level D - Associate Professor',
        5: 'Level E - Professor'
      },
      'RES': {
        1: 'Research Assistant',
        2: 'Research Associate',
        3: 'Senior Research Associate',
        4: 'Research Fellow',
        5: 'Senior Research Fellow'
      },
      'RESEARCH': {
        1: 'Research Assistant',
        2: 'Research Associate',
        3: 'Senior Research Associate',
        4: 'Research Fellow',
        5: 'Senior Research Fellow'
      },
      'HEW': {
        1: 'HEW Level 1',
        2: 'HEW Level 2',
        3: 'HEW Level 3',
        4: 'HEW Level 4',
        5: 'HEW Level 5',
        6: 'HEW Level 6',
        7: 'HEW Level 7',
        8: 'HEW Level 8',
        9: 'HEW Level 9',
        10: 'HEW Level 10'
      }
    };

    return descriptions[category]?.[level] || `${category} Level ${level}`;
  },

  /**
   * Format classification code for display
   */
  formatClassificationCode(code: string): string {
    const parsed = this.parseClassificationCode(code);
    
    if (parsed.category && parsed.level) {
      const categoryLabel = this.getCategoryLabel(parsed.category);
      const levelDesc = this.getLevelDescription(parsed.category, parsed.level);
      
      if (parsed.step) {
        return `${categoryLabel} ${levelDesc}, Step ${parsed.step}`;
      }
      return `${categoryLabel} ${levelDesc}`;
    }
    
    return code;
  },

  /**
   * Validate classification code format
   */
  validateClassificationCode(code: string): boolean {
    const parsed = this.parseClassificationCode(code);
    return parsed.level !== null;
  },

  /**
   * Get all valid classification codes for a category
   */
  getValidCodesForCategory(category: string): string[] {
    const codes: Record<string, string[]> = {
      'ACADEMIC': [
        'UOM-ACAD-1.1', 'UOM-ACAD-1.2', 'UOM-ACAD-1.3',
        'UOM-ACAD-2.1', 'UOM-ACAD-2.2', 'UOM-ACAD-2.3',
        'UOM-ACAD-3.1', 'UOM-ACAD-3.2', 'UOM-ACAD-3.3', 'UOM-ACAD-3.4',
        'UOM-ACAD-4.1', 'UOM-ACAD-4.2', 'UOM-ACAD-4.3',
        'UOM-ACAD-5.1', 'UOM-ACAD-5.2', 'UOM-ACAD-5.3'
      ],
      'RESEARCH': [
        'UOM-RES-1.1', 'UOM-RES-1.2',
        'UOM-RES-2.1', 'UOM-RES-2.2', 'UOM-RES-2.3',
        'UOM-RES-3.1', 'UOM-RES-3.2',
        'UOM-RES-4.1', 'UOM-RES-4.2',
        'UOM-RES-5.1', 'UOM-RES-5.2'
      ],
      'HEW': [
        'HEW-1', 'HEW-2', 'HEW-3', 'HEW-4', 'HEW-5',
        'HEW-6', 'HEW-7', 'HEW-8', 'HEW-9', 'HEW-10'
      ]
    };

    return codes[category] || [];
  }
};

// ===== Salary Calculation Utilities =====

export const salaryCalculationUtils = {
  /**
   * Calculate annual salary from base rate and multiplier
   */
  calculateAnnualSalary(baseRate: number, multiplier: number): number {
    return baseRate * multiplier;
  },

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
   * Format multiplier for display
   */
  formatMultiplier(multiplier: number): string {
    return multiplier.toFixed(6);
  }
};

export default salaryRateMultiplierService;
