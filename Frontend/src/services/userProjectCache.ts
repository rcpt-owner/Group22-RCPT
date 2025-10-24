import type { Project } from "./userService"

/**
 * Get cached projects from session storage.
 * NOTE: This module only handles list-of-projects caching (draft/new projects).
 * Per-project RCPT session/TTL logic lives in /services/rcptCache.ts
 */
export function getCachedProjects(userId: string): Project[] {
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
export function setCachedProjects(userId: string, projects: Project[]): void {
  try {
    const key = `user:${userId}:projects`;
    sessionStorage.setItem(key, JSON.stringify(projects));
  } catch {
    // Ignore storage errors
  }
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
