import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FileDown, Download } from "lucide-react"

type ExportTabProps = {
  totalCost: number
  staffCount: number
  nonStaffCount: number
}

export default function ExportTab({ totalCost, staffCount, nonStaffCount }: ExportTabProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [format, setFormat] = useState("CSV")

  const exportOptions = [
    { id: "projectDetails", label: "Project Details", description: "Name, description, duration, complexity" },
    { id: "staffCosts", label: "Staff Costs Details", description: "Roles, rates, hours, quantities" },
    { id: "nonStaffCosts", label: "Non-Staff Costs Details", description: "Items, costs, duration, type" },
    { id: "pricing", label: "Pricing and Summary", description: "All cost breakdown and pricing details" },
  ]

  const toggleSection = (id: string) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => setSelectedSections(exportOptions.map(opt => opt.id))
  const selectNone = () => setSelectedSections([])

  return (
    <div className="space-y-6 w-full">
      {/* Header Export Forms */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <FileDown className="h-6 w-6" />
            <CardTitle>Export Forms</CardTitle>
          </div>
          <CardDescription>
            Choose to export your project data into various PDF and CSV forms.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Export Forms Section */}
      <Card className="border rounded-lg">
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-2 pt-4">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="outline" size="sm" onClick={selectNone}>Select None</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exportOptions.map(opt => (
              <div key={opt.id} className="flex flex-col border rounded p-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedSections.includes(opt.id)}
                    onCheckedChange={() => toggleSection(opt.id)}
                  />
                  <span className="font-medium">{opt.label}</span>
                </div>
                {opt.description && <p className="text-sm text-muted-foreground ml-6">{opt.description}</p>}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
            <Select value={format} onValueChange={(val) => setFormat(val)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CSV">CSV (Excel Compatible)</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button>
                <Download className="h-6 w-6" />
                Export
              </Button>
            </div>
          </div>

          <Card className="border rounded-lg mt-4 p-4 bg-gray-50">
            <p>Total Cost: ${totalCost.toLocaleString()}</p>
            <p>Staff Members: {staffCount}</p>
            <p>Non-Staff Cost Items: {nonStaffCount}</p>
            <p>Selected Sections: {selectedSections.length} of {exportOptions.length}</p>
          </Card>
        </CardContent>
      </Card>

      
    </div>
  )
}
