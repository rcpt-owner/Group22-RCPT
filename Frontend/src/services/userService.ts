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

export const UserService = {
  getDashboard(userId = "1") {
    // TODO: wire to real backend GET /api/users/:userId/dashboard
    return getJson<UserDashboard>(`${BASE}/${userId}/dashboard.json`)
  },
}

export type ProjectStatus = "Draft" | "Submitted" | "Approved" | "Archived"

export type Project = {
  id: string
  title: string
  ownerUserId: string
  currency: string
  status: ProjectStatus
  staffCosts: number
  nonStaffCosts: number
  createdAt: string | Date
  updatedAt: string | Date
}

/**
 * Fetch projects for a user, merging with cached new projects.
 * TODO: Integrate real API/auth logic and error handling as backend evolves.
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  const { getCachedProjects } = await import("./userProjectCache");
  // TODO: when backend is ready, GET /api/users/:userId/projects and merge with cached drafts
  return getCachedProjects(userId);
}

/**
 * Create and cache a new project for the user.
 */
export async function createUserProject(userId: string, project: Project): Promise<void> {
  const { createUserProject: cacheCreate } = await import("./userProjectCache");
  // TODO: replace with POST to backend and fall back to local cache when offline
  cacheCreate(userId, project);
}

/**
 * Delete a cached project for the user.
 */
export async function deleteUserProject(userId: string, projectId: string): Promise<void> {
  const { deleteUserProject: cacheDelete } = await import("./userProjectCache");
  // TODO: replace with DELETE to backend and handle offline state
  cacheDelete(userId, projectId);
}

/**
 * Update the title of a cached project for the user.
 */
export async function updateProjectTitle(userId: string, projectId: string, newTitle: string): Promise<void> {
  const { updateProjectTitle: cacheUpdate } = await import("./userProjectCache");
  // TODO: replace with PATCH/PUT to backend and fall back to local cache when offline
  cacheUpdate(userId, projectId, newTitle);
}
