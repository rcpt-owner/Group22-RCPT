import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Home, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function AdminSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src="/resources/University-of-Melbourne-logo-1.png"
            alt="Unimelb Logo"
            className="h-16 w-auto"
          />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center tracking-wide uppercase">
          Research Costing and Pricing Tool
        </h1>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="default" size="icon" onClick={() => navigate("/adminSettings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Header card */}
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle className="text-lg font-semibold">Admin Settings</CardTitle>
            </div>
            <CardDescription className="text-gray-500 text-sm">
              Locate the section of the data that must be adjusted and enter in the new values.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-6 space-y-6 pb-8">

          {/* Salary Rates */}
          <SectionCard
            title="Salary Rates"
            description="Update the salary rates by going off the ID, Payroll Type, etc."
            fields={[
              { label: "Vlookup ID", type: "select", placeholder: "Description of input" },
              { label: "Payroll Type", type: "select", placeholder: "Description of input" },
              { label: "Category", type: "select", placeholder: "Description of input" },
              { label: "Classification", type: "select", placeholder: "Description of input" },
              { label: "Rate (est)", type: "input", placeholder: "Description of input" },
            ]}
          />

          {/* Multipliers */}
          <SectionCard
            title="Multipliers"
            description="Update the pricing multipliers."
            fields={[
              { label: "EBA Multiplier", type: "input", placeholder: "Enter new multiplier value as a decimal" },
              { label: "Salary Rate Multiplier", type: "input", placeholder: "Enter new multiplier value as a decimal" },
              { label: "Full Cost Recovery Multiplier", type: "input", placeholder: "Enter new multiplier value as a decimal" },
            ]}
          />

          {/* Leave and Employment Settings */}
          <SectionCard
            title="Leave and Employment Settings"
            description="Update the leave and other employment rates."
            fields={[
              { label: "Stipend Rate", type: "input", placeholder: "Enter stipend rate as a dollar amount" },
              { label: "Superannuation Rate", type: "input", placeholder: "Enter super value as a percentage" },
              { label: "Leave Loading", type: "input", placeholder: "Enter loading value as a percentage" },
              { label: "Payroll Tax", type: "input", placeholder: "Enter tax value as a percentage" },
              { label: "Work Cover", type: "input", placeholder: "Enter work cover industry rate" },
              { label: "Parental Leave", type: "input", placeholder: "Enter weekly rate as a dollar amount" },
              { label: "Working days", type: "input", placeholder: "Enter number of working days" },
            ]}
          />

          {/* Lookup Lists */}
          <SectionCard
            title="Lookup Lists"
            description="Add a new option to a drop down menu."
            fields={[
              { label: "Research Type", type: "input", placeholder: "Add new list option." },
              { label: "Regions", type: "input", placeholder: "Add new list option." },
              { label: "Deliverable Types", type: "input", placeholder: "Add new list option." },
              { label: "Departments", type: "input", placeholder: "Add new list option." },
              { label: "Revenue Categories", type: "input", placeholder: "Add new list option." },
              { label: "Non-Staff Cost Types", type: "input", placeholder: "Add new list option." },
            ]}
          />

        </div>
      </main>
    </div>
  );
}

function SectionCard({ title, description, fields }: { title: string; description?: string; fields: { label: string; type: "input" | "select"; placeholder?: string }[] }) {
  const colsClass = fields.length >= 8 ? "grid-cols-4" : fields.length >= 4 ? "grid-cols-4" : "grid-cols-3";
  const { toast } = useToast();

  const handleSave = () => {
      // add your save logic here
      toast({
        title: "Saved successfully!",
        description: `${title} settings have been updated.`,
        duration: 2500, // disappears after 2.5s
      });
    };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-gray-500">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <div className={`grid ${colsClass} gap-4`}>
          {fields.map((f, idx) => (
            <Field key={idx} label={f.label} type={f.type} placeholder={f.placeholder} />
          ))}
        </div>

        <div className="flex items-center justify-end gap-4 pt-1">
          <Button onClick={handleSave} className="bg-black text-white px-6">Save</Button>
          <p className="text-sm text-gray-500">Last Update was from 1-May-25</p>
        </div>

      </CardContent>
    </Card>
  );
}

function Field({ label, type, placeholder }: { label: string; type: "input" | "select"; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2 leading-5">
        {label}
      </label>

      {type === "select" ? (
        <Select>
          <SelectTrigger className="h-10 text-sm">
            <SelectValue placeholder={placeholder || ""} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Input placeholder={placeholder} className="h-10 text-sm" />
      )}
    </div>
  );
}
