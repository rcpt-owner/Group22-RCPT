// services/userService.ts
// User service connected to Spring Boot backend

import { apiService } from './api';
import { projectService } from './projectService';

// ==================== Types ====================

export interface User {
  id: string;
  email: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  department?: string;
  active: boolean;
  roles: string[];
  createdDate: string;
  updatedDate: string;
}

export interface CreateUserRequest {
  email: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  department?: string;
}

export interface UpdateUserRequest {
  displayName?: string;
  givenName?: string;
  familyName?: string;
  department?: string;
  active?: boolean;
  roles?: string[];
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

// Legacy types (keeping for compatibility)
export interface UserDashboard {
  userId: string;
  recentProjects: { id: string; name: string }[];
  unreadNotifications: number;
  lastLogin: string;
}

export type ProjectStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type Project = {
  id: string;
  title: string;
  ownerUserId: string;
  currency: string;
  status: ProjectStatus;
  staffCosts: number;
  nonStaffCosts: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

// ==================== Service Implementation ====================

const BASE_PATH = 'api/v1/users';

// Temporary default user ID until auth is implemented
const DEFAULT_USER_ID = 'dev-user-001';

export const UserService = {
  // ===== CRUD Operations (Connected to Backend) =====

  /**
   * Create a new user
   */
  async create(data: CreateUserRequest): Promise<User> {
    return apiService.post<User>(BASE_PATH, data);
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return apiService.get<User>(`${BASE_PATH}/${id}`);
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User> {
    return apiService.get<User>(`${BASE_PATH}/by-email`, { email });
  },

  /**
   * List all users with pagination
   */
  async list(page: number = 0, size: number = 20): Promise<PageResponse<User>> {
    return apiService.get<PageResponse<User>>(BASE_PATH, { page, size });
  },

  /**
   * Update user (partial update)
   */
  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiService.patch<User>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Activate user
   */
  async activate(id: string): Promise<User> {
    return apiService.post<User>(`${BASE_PATH}/${id}/activate`);
  },

  /**
   * Deactivate user
   */
  async deactivate(id: string): Promise<User> {
    return apiService.post<User>(`${BASE_PATH}/${id}/deactivate`);
  },

  /**
   * Add role to user
   */
  async addRole(id: string, role: string): Promise<User> {
    return apiService.post<User>(`${BASE_PATH}/${id}/roles`, { role });
  },

  /**
   * Remove role from user
   */
  async removeRole(id: string, role: string): Promise<User> {
    return apiService.delete<User>(`${BASE_PATH}/${id}/roles/${role}`);
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    return apiService.delete(`${BASE_PATH}/${id}`);
  },

  // ===== Legacy Methods (Updated to use Backend) =====

  /**
   * Get user dashboard data
   * Creates dashboard from user and project data
   */
  async getDashboard(userId: string = DEFAULT_USER_ID): Promise<UserDashboard> {
    try {
      // Get user data
      const user = await this.getById(userId);

      // Get recent projects
      const projects = await projectService.getRecentProjects(userId);
      const recentProjects = projects.map(p => ({
        id: p.id,
        name: p.title
      }));

      return {
        userId: user.id,
        recentProjects,
        unreadNotifications: 0, // Would need a notifications endpoint
        lastLogin: user.updatedDate
      };
    } catch (error) {
      // Return default dashboard if backend not available
      return {
        userId,
        recentProjects: [],
        unreadNotifications: 0,
        lastLogin: new Date().toISOString()
      };
    }
  },

  // ===== Helper Methods =====

  /**
   * Get current user (temporary - uses default ID)
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.getById(DEFAULT_USER_ID);
    } catch {
      return null;
    }
  },

  /**
   * Check if email exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      await this.getByEmail(email);
      return true;
    } catch (error: any) {
      // If 404, email doesn't exist
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  },

  /**
   * Get users by department
   */
  async getByDepartment(department: string, page: number = 0, size: number = 20): Promise<User[]> {
    // This would need a backend endpoint with filtering
    // For now, fetch all and filter client-side
    const response = await this.list(page, size);
    return response.content.filter(user => user.department === department);
  },

  /**
   * Get users by role
   */
  async getByRole(role: string, page: number = 0, size: number = 20): Promise<User[]> {
    // This would need a backend endpoint with filtering
    // For now, fetch all and filter client-side
    const response = await this.list(page, size);
    return response.content.filter(user => user.roles.includes(role));
  },

  /**
   * Get active users only
   */
  async getActiveUsers(page: number = 0, size: number = 20): Promise<User[]> {
    const response = await this.list(page, size);
    return response.content.filter(user => user.active);
  }
};

// ===== Project-related functions (using projectService) =====

/**
 * Fetch projects for a user
 */
export async function getUserProjects(userId: string = DEFAULT_USER_ID): Promise<Project[]> {
  const projects = await projectService.getUserProjects(userId);

  // Transform to legacy format
  return projects.map(p => ({
    id: p.id,
    title: p.title,
    ownerUserId: p.ownerUserId,
    currency: p.priceSummary?.totalCost?.currency || 'AUD',
    status: p.status as ProjectStatus,
    staffCosts: p.priceSummary?.totalStaffCost?.amount || 0,
    nonStaffCosts: p.priceSummary?.totalNonStaffCost?.amount || 0,
    createdAt: p.createdDate,
    updatedAt: p.updatedDate
  }));
}

/**
 * Create a new project for the user
 */
export async function createUserProject(userId: string, project: Partial<Project>): Promise<void> {
  await projectService.create({
    title: project.title || 'New Project',
    description: '',
    details: {}
  }, userId);
}

/**
 * Delete a project for the user
 */
export async function deleteUserProject(userId: string, projectId: string): Promise<void> {
  // Verify ownership before deleting
  const project = await projectService.getById(projectId);
  if (project.ownerUserId === userId) {
    await projectService.delete(projectId);
  }
}

/**
 * Update the title of a project
 */
export async function updateProjectTitle(userId: string, projectId: string, newTitle: string): Promise<void> {
  // Verify ownership before updating
  const project = await projectService.getById(projectId);
  if (project.ownerUserId === userId) {
    await projectService.update(projectId, { title: newTitle });
  }
}

// ===== Utility Functions =====

export const userUtils = {
  /**
   * Format user name for display
   */
  formatName(user: User): string {
    if (user.displayName) {
      return user.displayName;
    }

    const parts = [];
    if (user.givenName) parts.push(user.givenName);
    if (user.familyName) parts.push(user.familyName);

    if (parts.length > 0) {
      return parts.join(' ');
    }

    // Fall back to email username
    return user.email.split('@')[0] || user.email;
  },

  /**
   * Get user initials
   */
  getInitials(user: User): string {
    const name = this.formatName(user);
    const parts = name.split(' ');

    if (parts.length >= 2) {
      const first = parts[0]?.[0] || '';
      const last = parts[parts.length - 1]?.[0] || '';
      return `${first}${last}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  },

  /**
   * Check if user has role
   */
  hasRole(user: User, role: string): boolean {
    return user.roles.includes(role);
  },

  /**
   * Check if user is admin
   */
  isAdmin(user: User): boolean {
    return this.hasRole(user, 'ADMIN') || this.hasRole(user, 'admin');
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Export as default for backward compatibility
export default UserService;