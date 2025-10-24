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

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  /** ---------------- Salary Rates ---------------- */
  const [code, setCode] = useState("");
  const [rate, setRate] = useState("");
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState("");

  const handleCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    setRateLoading(true);
    setRateError("");

    if (!newCode.trim()) {
      setCurrentRate(null);
      setRateLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/salary-rates/${encodeURIComponent(newCode)}`
      );
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setCurrentRate(data.fte_rate);
    } catch {
      setCurrentRate(null);
      setRateError("Could not find that code in the database.");
    } finally {
      setRateLoading(false);
    }
  };

  /** ---------------- Multipliers ---------------- */
  const [multiplierYear, setMultiplierYear] = useState("");
  const [ebaMultiplier, setEbaMultiplier] = useState("");
  const [salaryRateMultiplier, setSalaryRateMultiplier] = useState("");
  const [multiplierLoading, setMultiplierLoading] = useState(false);
  const [multiplierError, setMultiplierError] = useState("");

  const handleMultiplierYearChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    setMultiplierYear(year);
    setMultiplierLoading(true);
    setMultiplierError("");

    if (!year.trim()) {
      setEbaMultiplier("");
      setSalaryRateMultiplier("");
      setMultiplierLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/eba/${encodeURIComponent(year)}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setEbaMultiplier(data.eba_multiplier.toString());
      setSalaryRateMultiplier(data.eba_multiplier.toString()); // Adjust if salaryRateMultiplier is separate
    } catch {
      setEbaMultiplier("");
      setSalaryRateMultiplier("");
      setMultiplierError("Could not find multipliers for that year.");
    } finally {
      setMultiplierLoading(false);
    }
  };

  /** ---------------- Employment Settings ---------------- */
  const [employmentYear, setEmploymentYear] = useState("");
  const [stipendRate, setStipendRate] = useState("");
  const [payrollTax, setPayrollTax] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [employmentLoading, setEmploymentLoading] = useState(false);
  const [employmentError, setEmploymentError] = useState("");

  const handleEmploymentYearChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    setEmploymentYear(year);
    setEmploymentLoading(true);
    setEmploymentError("");

    if (!year.trim()) {
      setStipendRate("");
      setPayrollTax("");
      setWorkingDays("");
      setEmploymentLoading(false);
      return;
    }

    try {
      // Fetch stipend
      const stipendRes = await fetch(`http://localhost:8080/api/stipends/${encodeURIComponent(year)}`);
      const stipendData = stipendRes.ok ? await stipendRes.json() : null;

      // Fetch payroll tax
      const payrollRes = await fetch(`http://localhost:8080/api/payroll-tax/${encodeURIComponent(year)}`);
      const payrollData = payrollRes.ok ? await payrollRes.json() : null;

      setStipendRate(stipendData?.rate?.toString() ?? "");
      setPayrollTax(payrollData?.rate?.toString() ?? "");
      setWorkingDays(""); // adjust if you have an endpoint for working days
    } catch {
      setStipendRate("");
      setPayrollTax("");
      setWorkingDays("");
      setEmploymentError("Could not find employment settings for that year.");
    } finally {
      setEmploymentLoading(false);
    }
  };

  /** ---------------- Staff Benefits ---------------- */
  const [staffType, setStaffType] = useState("");
  const [superannuation, setSuperannuation] = useState("");
  const [leaveLoading, setLeaveLoading] = useState("");
  const [workCover, setWorkCover] = useState("");
  const [parentalLeave, setParentalLeave] = useState("");
  const [longServiceLeave, setLongServiceLeave] = useState("");
  const [annualLeave, setAnnualLeave] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState("");

  const handleStaffTypeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value;
    setStaffType(type);
    setStaffLoading(true);
    setStaffError("");

    if (!type.trim()) {
      setSuperannuation("");
      setLeaveLoading("");
      setWorkCover("");
      setParentalLeave("");
      setLongServiceLeave("");
      setAnnualLeave("");
      setStaffLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/staff-benefits/${encodeURIComponent(type)}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setSuperannuation(data.superannuation.toString());
      setLeaveLoading(data.leave_loading.toString());
      setWorkCover(data.work_cover.toString());
      setParentalLeave(data.parental_leave.toString());
      setLongServiceLeave(data.long_service_leave.toString());
      setAnnualLeave(data.annual_leave.toString());
    } catch {
      setSuperannuation("");
      setLeaveLoading("");
      setWorkCover("");
      setParentalLeave("");
      setLongServiceLeave("");
      setAnnualLeave("");
      setStaffError("Could not find staff benefits for that type.");
    } finally {
      setStaffLoading(false);
    }
  };

  /** ---------------- Save Handler ---------------- */
  const handleSave = (section: string) => {
    toast({
      title: "Saved successfully!",
      description: `${section} have been updated.`,
      duration: 2500,
    });
  };

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
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 space-y-6 pb-8">
        {/* Salary Rates */}
        <SectionCard
          title="Salary Rates"
          description="Update a salary rate based on its code. Eg 'CasualAcademicRA Grade 1.1' or 'CasualAcademicLevel E.1' etc."
          fields={[
            {
              label: "Code",
              type: "input",
              placeholder: "Enter the code",
              value: code,
              onChange: handleCodeChange,
              extra: rateLoading
                ? "Fetching current rate..."
                : rateError
                ? <span className="text-red-500">{rateError}</span>
                : null,
            },
            {
              label: "Rate",
              type: "input",
              placeholder: "Enter the new salary rate",
              value: rate,
              onChange: (e) => setRate(e.target.value),
              extra: currentRate !== null && !rateLoading
                ? <>Current FTE rate for <strong>{code}</strong>: ${currentRate.toLocaleString()}</>
                : null,
            },
          ]}
        />

        {/* Multipliers */}
        <SectionCard
          title="Multipliers"
          description="Update the pricing multipliers based on year."
          fields={[
            {
              label: "Year",
              type: "input",
              placeholder: "Enter the year",
              value: multiplierYear,
              onChange: handleMultiplierYearChange,
              extra: multiplierLoading
                ? "Fetching current multipliers..."
                : multiplierError
                ? <span className="text-red-500">{multiplierError}</span>
                : null,
            },
            {
              label: "EBA Multiplier",
              type: "input",
              placeholder: "Enter new eba multiplier (eg. 1.12551)",
              value: ebaMultiplier,
              onChange: (e) => setEbaMultiplier(e.target.value),
            },
            {
              label: "Salary Rate Multiplier",
              type: "input",
              placeholder: "Enter new salary rate multiplier (FTE)",
              value: salaryRateMultiplier,
              onChange: (e) => setSalaryRateMultiplier(e.target.value),
            },
          ]}
        />

        {/* Employment Settings */}
        <SectionCard
          title="Employment Settings"
          description="Update the employment settings based on year."
          fields={[
            {
              label: "Year",
              type: "input",
              placeholder: "Enter the year",
              value: employmentYear,
              onChange: handleEmploymentYearChange,
              extra: employmentLoading
                ? "Fetching current settings..."
                : employmentError
                ? <span className="text-red-500">{employmentError}</span>
                : null,
            },
            {
              label: "Stipend Rate",
              type: "input",
              placeholder: "Enter new stipend rate as a dollar amount",
              value: stipendRate,
              onChange: (e) => setStipendRate(e.target.value),
            },
            {
              label: "Payroll Tax",
              type: "input",
              placeholder: "Enter new payroll tax value as a decimal",
              value: payrollTax,
              onChange: (e) => setPayrollTax(e.target.value),
            },
            {
              label: "Working Days",
              type: "input",
              placeholder: "Enter new number of working days",
              value: workingDays,
              onChange: (e) => setWorkingDays(e.target.value),
            },
          ]}
        />

        {/* Staff Benefits */}
        <SectionCard
          title="Staff Benefits"
          description="Update the staff benefit rates based on staff type."
          fields={[
            {
              label: "Staff Type",
              type: "input",
              placeholder: "Casual, Fixed-Term or Continuing",
              value: staffType,
              onChange: handleStaffTypeChange,
              extra: staffLoading
                ? "Fetching staff benefits..."
                : staffError
                ? <span className="text-red-500">{staffError}</span>
                : null,
            },
            { label: "Superannuation Rate", type: "input", placeholder: "Enter super value as a percentage", value: superannuation, onChange: (e) => setSuperannuation(e.target.value) },
            { label: "Leave Loading", type: "input", placeholder: "Enter loading value as a percentage", value: leaveLoading, onChange: (e) => setLeaveLoading(e.target.value) },
            { label: "Work Cover", type: "input", placeholder: "Enter work cover industry rate", value: workCover, onChange: (e) => setWorkCover(e.target.value) },
            { label: "Parental Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: parentalLeave, onChange: (e) => setParentalLeave(e.target.value) },
            { label: "Long-Service Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: longServiceLeave, onChange: (e) => setLongServiceLeave(e.target.value) },
            { label: "Annual Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: annualLeave, onChange: (e) => setAnnualLeave(e.target.value) },
          ]}
        />
      </main>
    </div>
  );
}

/** ---------------- SectionCard Component ---------------- */
function SectionCard({ title, description, fields }: { title: string; description?: string, fields: any[] }) {
  const { toast } = useToast();
  const colsClass = fields.length >= 8 ? "grid-cols-4" : fields.length >= 4 ? "grid-cols-4" : "grid-cols-3";

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
            <div key={idx}>
              <Field
                label={f.label}
                type={f.type}
                placeholder={f.placeholder}
                value={f.value}
                onChange={f.onChange}
              />
              {f.extra && <div className="mt-1 text-xs text-gray-500">{f.extra}</div>}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 pt-1">
          <Button
            onClick={() => toast({ title: "Saved successfully!", description: `${title} updated.`, duration: 2500 })}
            className="bg-black text-white px-6"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/** ---------------- Field Component ---------------- */
function Field({ label, type, placeholder, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2 leading-5">{label}</label>
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
        <Input placeholder={placeholder} className="h-10 text-sm" value={value} onChange={onChange} />
      )}
    </div>
  );
}
