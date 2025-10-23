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
import { Settings, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define all API endpoints
const endpoints = {
  eba: "/api/eba",
  payrollTax: "/api/payroll-tax",
  departments: "/api/departments",
  regions: "/api/regions",
  salaryRates: "/api/salary-rates",
  multipliers: "/api/salary-rate-multipliers",
  staffBenefits: "/api/staff-benefits",
  stipends: "/api/stipends",
};

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
            description="Update a salary rate based on its code. Eg 'CasualAcademicRA Grade 1.1' or 'CasualAcademicLevel E.1'."
            fields={[
              { label: "Code", type: "input", placeholder: "Enter the code you wish to change the rate of" },
              { label: "Rate", type: "input", placeholder: "Enter the new salary rate" },
            ]}
          />

          {/* Multipliers */}
          <SectionCard
            title="Multipliers"
            description="Update the pricing multipliers based on year."
            fields={[
              { label: "Year", type: "input", placeholder: "Enter the year" },
              { label: "EBA Multiplier", type: "input", placeholder: "Enter new eba multiplier value as a decimal" },
              { label: "Salary Rate Multiplier", type: "input", placeholder: "Enter new salary rate multiplier value as a decimal" },
            ]}
          />

          {/* Employment Settings */}
          <SectionCard
            title="Employment Settings"
            description="Update the employment settings based on year."
            fields={[
              { label: "Year", type: "input", placeholder: "Enter the year" },
              { label: "Stipend Rate", type: "input", placeholder: "Enter new stipend rate as a dollar amount" },
              { label: "Payroll Tax", type: "input", placeholder: "Enter new payroll tax value as a decimal" },
              { label: "Working Days", type: "input", placeholder: "Enter new number of working days" },
            ]}
          />

          {/* Staff Benefits */}
          <SectionCard
            title="Staff Benefits"
            description="Update the staff benefit rates based on staff type."
            fields={[
              { label: "Staff Type", type: "input", placeholder: "Casual, Fixed-Term or Continuing " },
              { label: "Superannuation Rate", type: "input", placeholder: "Enter super value as a percentage" },
              { label: "Leave Loading", type: "input", placeholder: "Enter loading value as a percentage" },
              { label: "Work Cover", type: "input", placeholder: "Enter work cover industry rate" },
              { label: "Parental Leave", type: "input", placeholder: "Enter weekly rate as a dollar amount" },
              { label: "Long-Service Leave", type: "input", placeholder: "Enter weekly rate as a dollar amount" },
              { label: "Annual Leave", type: "input", placeholder: "Enter weekly rate as a dollar amount" },
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
        description: `${title} have been updated.`,
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