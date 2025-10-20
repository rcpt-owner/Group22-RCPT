// Using a tmp "userId" of "1" for all calls until auth is implemented
// Using a tmp cache in sessionStorage for new projects until backend is ready
const BASE = "/api/users"

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}

export interface UserDashboard {
  userId: string
  recentProjects: { id: string; name: string }[]
  unreadNotifications: number
  lastLogin: string
}

export interface UserNotification {
  id: string
  type: string
  message: string
  createdAt: string
  read: boolean
}

export const UserService = {
  getDashboard(userId = "1") {
    return getJson<UserDashboard>(`${BASE}/${userId}/dashboard.json`)
  },
  getNotifications(userId = "1") {
    return getJson<UserNotification[]>(`${BASE}/${userId}/notifications.json`)
  },
  getNotification(notificationId: string, userId = "1") {
    return getJson<UserNotification>(`${BASE}/${userId}/notifications/${notificationId}.json`)
  },
}

export type ProjectStatus = "Draft" | "Submitted" | "Approved" | "Archived"

export type Project = {
  id: string
  title: string
  ownerUserId: string
  currency: string // not displayed; assume AUD
  status: ProjectStatus
  staffCosts: number // not displayed
  nonStaffCosts: number // not displayed
  createdAt: string | Date
  updatedAt: string | Date
}

/**
 * Fetch projects for a user, merging with cached new projects.
 * TODO: Integrate real API/auth logic and error handling as backend evolves.
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  // Load from static mock for now
  const fetched = await getJson<Project[]>(`${BASE}/${userId}/projects.json`);
  // Merge with cached new projects
  const cached = getCachedProjects(userId);
  const merged = [...fetched, ...cached.filter(cp => !fetched.some(fp => fp.id === cp.id))];
  return merged;
}

/**
 * Create and cache a new project for the user.
 */
export function createUserProject(userId: string, project: Project): void {
  const cached = getCachedProjects(userId);
  cached.push(project);
  setCachedProjects(userId, cached);
}

/**
 * Delete a cached project for the user.
 */
export function deleteUserProject(userId: string, projectId: string): void {
  const cached = getCachedProjects(userId);
  const updated = cached.filter(p => p.id !== projectId);
  setCachedProjects(userId, updated);
}

/**
 * Update the title of a cached project for the user.
 */
export function updateProjectTitle(userId: string, projectId: string, newTitle: string): void {
  const cached = getCachedProjects(userId);
  const project = cached.find(p => p.id === projectId);
  if (project) {
    project.title = newTitle;
    project.updatedAt = new Date().toISOString();
    setCachedProjects(userId, cached);
  }
}

/**
 * Get cached projects from session storage.
 */
function getCachedProjects(userId: string): Project[] {
  try {
    const key = `user:${userId}:projects`;
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Set cached projects in session storage.
 */
function setCachedProjects(userId: string, projects: Project[]): void {
  try {
    const key = `user:${userId}:projects`;
    sessionStorage.setItem(key, JSON.stringify(projects));
  } catch {
    // Ignore storage errors
  }
}
