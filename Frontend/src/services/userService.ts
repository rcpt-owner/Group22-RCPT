// Mock user service consuming /public/api/users/... JSON files.

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
