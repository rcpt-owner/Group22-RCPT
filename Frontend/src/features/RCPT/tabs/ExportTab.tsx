import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, Download } from "lucide-react"

type ExportTabProps = {
  projectId: string
  totalCost: number
  staffCount: number
  nonStaffCount: number
}

export default function ExportTab({ projectId}: ExportTabProps) {
  const [downloading, setDownloading] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080"

  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/export`, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      })

      if (!res.ok) {
        throw new Error("Failed to generate PDF")
      }

      // Convert to blob and trigger download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `project_${projectId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading PDF:", err)
      alert("There was a problem downloading the PDF.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <FileDown className="h-6 w-6" />
            <CardTitle>Export Project</CardTitle>
          </div>
          <CardDescription>Download your project details as a PDF file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleDownloadPdf} disabled={downloading}>
            <Download className="h-5 w-5 mr-2" />
            {downloading ? "Downloading..." : "Download PDF"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
