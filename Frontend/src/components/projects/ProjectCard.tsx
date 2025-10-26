import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/services/userService"

type Status = Project["status"]

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface ProjectCardProps {
  id: string
  title: string
  ownerUserId: string
  status: Status
  createdAt: string | Date
  updatedAt: string | Date
  onClick?: () => void
}

function formatDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value)
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString()
}

const statusStyles: Record<
  Status,
  { variant: BadgeVariant; className?: string }
> = {
  DRAFT: { variant: "secondary" },
  IN_REVIEW: { variant: "default" },
  APPROVED: {
    variant: "secondary",
    className: "bg-green-100 text-green-800 border border-green-200",
  },
  REJECTED: { variant: "destructive" },
  COMPLETED: {
    variant: "secondary",
    className: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  CANCELLED: { variant: "outline" },
}

export function ProjectCard({
  title,
  ownerUserId,
  status,
  createdAt,
  updatedAt,
  onClick,
}: ProjectCardProps) {
  const { variant, className } = statusStyles[status]

  return (
    <Card
      className="transition hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="bg-gray-200 h-24 w-full rounded-md mb-3" />
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardContent className="p-0 mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={variant} className={`text-xs px-2 py-0.5 ${className ?? ""}`}>
              {status}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Owner: {ownerUserId}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Created: {formatDate(createdAt)}</p>
            <p>Last updated: {formatDate(updatedAt)}</p>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
