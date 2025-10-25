import { useState } from "react";
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

// Define the section types
type SectionTitle =
  | "departments"
  | "eba"
  | "payrollTax"
  | "regions"
  | "salaryRates"
  | "salaryRateMultipliers"
  | "staffBenefits"
  | "stipends"
  | "users";

// Define all endpoints
const endpoints: Record<SectionTitle, string> = {
  departments: "http://localhost:8080/api/departments",
  eba: "http://localhost:8080/api/eba",
  payrollTax: "http://localhost:8080/api/payroll-tax",
  regions: "http://localhost:8080/api/regions",
  salaryRates: "http://localhost:8080/api/salary-rates",
  salaryRateMultipliers: "http://localhost:8080/api/salary-rate-multipliers",
  staffBenefits: "http://localhost:8080/api/staff-benefits",
  stipends: "http://localhost:8080/api/stipends",
  users: "http://localhost:8080/api/users",
};

export type { SectionTitle };
export { endpoints };

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
      setCurrentRate(data.fteRate);
    } catch {
      setCurrentRate(null);
      setRateError("Could not find that code in the database, add a new salary code with its rate.");
    } finally {
      setRateLoading(false);
    }
  };

  /** ---------------- Multipliers ---------------- */
  const [multiplierYear, setMultiplierYear] = useState("");
  const [eba, setEba] = useState("");
  const [salaryRateMultiplier, setSalaryRateMultiplier] = useState("");
  const [multiplierLoading, setMultiplierLoading] = useState(false);
  const [multiplierError, setMultiplierError] = useState("");

  const handleMultiplierYearChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = e.target.value;
    setMultiplierYear(year);
    setMultiplierLoading(true);
    setMultiplierError("");

    if (!year.trim()) {
      setEba("");
      setSalaryRateMultiplier("");
      setMultiplierLoading(false);
      return;
    }

    try {
      const ebaRes = await fetch(`${endpoints.eba}/${encodeURIComponent(year)}`);
      if (!ebaRes.ok) throw new Error("Not found");
      const ebaData = await ebaRes.json();

      setEba(ebaData.ebaIncrease.toString());
      setSalaryRateMultiplier(ebaData.ebaMultiplier.toString());
    } catch {
      setEba("");
      setSalaryRateMultiplier("");
      setMultiplierError("Could not find multipliers for that year, add a new year with its multipliers.");
    } finally {
      setMultiplierLoading(false);
    }
  };

  /** ---------------- Employment Settings ---------------- */
  const [employmentYear, setEmploymentYear] = useState("");
  const [stipendRate, setStipendRate] = useState("");
  const [payrollTax, setPayrollTax] = useState("");
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
      setEmploymentLoading(false);
      return;
    }

    try {
      // Fetch stipend
      const stipendRes = await fetch(
        `${endpoints.stipends}/${encodeURIComponent(year)}`
      );
      const stipendData = stipendRes.ok ? await stipendRes.json() : null;

      // Fetch payroll tax
      const payrollRes = await fetch(
        `${endpoints.payrollTax}/${encodeURIComponent(year)}`
      );
      const payrollData = payrollRes.ok ? await payrollRes.json() : null;

      setStipendRate(stipendData?.rate?.toString() ?? "");
      setPayrollTax(payrollData?.rate?.toString() ?? "");
    } catch {
      setStipendRate("");
      setPayrollTax("");
      setEmploymentError("Could not find employment settings for that year, add a new year with its employment settings.");
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
      const staffBenefitsRes = await fetch(
        `${endpoints.staffBenefits}/${encodeURIComponent(type)}`
      );
      if (!staffBenefitsRes.ok) throw new Error("Not found");
      const staffBenefitsData = await staffBenefitsRes.json();

      setSuperannuation(staffBenefitsData.superannuation.toString());
      setLeaveLoading(staffBenefitsData.leaveLoading.toString());
      setWorkCover(staffBenefitsData.workCover.toString());
      setParentalLeave(staffBenefitsData.parentalLeave.toString());
      setLongServiceLeave(staffBenefitsData.longServiceLeave.toString());
      setAnnualLeave(staffBenefitsData.annualLeave.toString());
    } catch {
      setSuperannuation("");
      setLeaveLoading("");
      setWorkCover("");
      setParentalLeave("");
      setLongServiceLeave("");
      setAnnualLeave("");
      setStaffError("Could not find staff benefits for that type, choose a current staff type or enter new benefits for your new type.");
    } finally {
      setStaffLoading(false);
    }
  };

  /** ---------------- Save Handler ---------------- */
  /** ---------------- Save Handler with Validation ---------------- */
  const handleSave = async (title: string) => {
    console.log("Attempting to save section:", title);

    const titleToKey: Record<string, SectionTitle | SectionTitle[]> = {
      "Salary Rates": "salaryRates",
      "Multipliers": ["eba", "salaryRateMultipliers"],
      "Employment Settings": ["stipends", "payrollTax"],
      "Staff Benefits": "staffBenefits",
    };

    const key = titleToKey[title];
    if (!key) {
      toast({
        title: "Error",
        description: `No endpoint found for ${title}`,
        variant: "destructive"
      });
      return;
    }

    let payload: Record<string, any> = {};

    switch (title) {
      case "Salary Rates":
        if (!code.trim() || isNaN(parseFloat(rate))) {
          toast({
            title: "Invalid data",
            description: "Please enter a valid code and numeric rate.",
            variant: "destructive"
          });
          return;
        }
        payload = {
          code,
          name: code, // or a proper descriptive name from user input
          payrollType: "Professional", // or input field
          category: "UOM", // or input field
          fteRate: parseFloat(rate),
          dailyRate: null,
          hourlyRate: null
        };
        break;

      case "Multipliers":
        if (!multiplierYear.trim() || isNaN(parseFloat(eba)) || isNaN(parseFloat(salaryRateMultiplier))) {
          toast({
            title: "Invalid data",
            description: "Please enter a valid year, EBA increase, and multiplier.",
            variant: "destructive"
          });
          return;
        }

        // Payload for EBA
        const ebaPayload = {
          year: parseInt(multiplierYear),
          ebaIncrease: parseFloat(eba) || 0, // default 0 if empty
          ebaMultiplier: parseFloat(salaryRateMultiplier)
        };

        // Payload for Salary Rate Multiplier
        // Assuming 'unit' is derived from the multiplierYear (or another field)
        const multiplierPayload = {
          unit: multiplierYear,
          multiplier: parseFloat(salaryRateMultiplier)
        };

        try {
          // Save EBA first
          const ebaRes = await fetch(endpoints.eba, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ebaPayload)
          });
          if (!ebaRes.ok) throw new Error(`EBA save failed (${ebaRes.status})`);

          // Save Salary Rate Multiplier
          const multiplierRes = await fetch(endpoints.salaryRateMultipliers, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(multiplierPayload)
          });
          if (!multiplierRes.ok) throw new Error(`Salary Rate Multiplier save failed (${multiplierRes.status})`);

          toast({
            title: "Saved successfully!",
            description: "Multipliers updated.",
            duration: 2500,
          });
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }

      case "Employment Settings":
          if (!employmentYear.trim() || isNaN(parseFloat(stipendRate)) || isNaN(parseFloat(payrollTax))) {
            toast({
              title: "Invalid data",
              description: "Please enter a valid year, stipend rate and payroll tax.",
              variant: "destructive"
            });
            return;
          }

          // Payloads for separate endpoints
          const stipendPayload = {
            year: parseInt(employmentYear),
            rate: parseFloat(stipendRate),
          };

          const payrollPayload = {
            year: parseInt(employmentYear),
            rate: parseFloat(payrollTax),
          };

          try {
            const stipendRes = await fetch(endpoints.stipends, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(stipendPayload),
            });
            if (!stipendRes.ok) throw new Error(`Stipend save failed (${stipendRes.status})`);

            const payrollRes = await fetch(endpoints.payrollTax, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payrollPayload),
            });
            if (!payrollRes.ok) throw new Error(`Payroll Tax save failed (${payrollRes.status})`);

            toast({
              title: "Saved successfully!",
              description: `${title} updated.`,
              duration: 2500,
            });
          } catch (err: any) {
            toast({
              title: "Error",
              description: err.message,
              variant: "destructive",
            });
          }
          return; // return here so it skips the generic endpoints loop

      case "Staff Benefits":
        if (
          !staffType.trim() ||
          [superannuation, leaveLoading, workCover, parentalLeave, longServiceLeave, annualLeave]
            .some((v) => isNaN(parseFloat(v)))
        ) {
          toast({
            title: "Invalid data",
            description: "Please enter valid staff type and numeric values for all benefits.",
            variant: "destructive"
          });
          return;
        }
        payload = {
          staffType: staffType.trim(),
          superannuation: parseFloat(superannuation),
          leaveLoading: parseFloat(leaveLoading),
          workCover: parseFloat(workCover),
          parentalLeave: parseFloat(parentalLeave),
          longServiceLeave: parseFloat(longServiceLeave),
          annualLeave: parseFloat(annualLeave)
        };
        break;

      default:
        toast({
          title: "Error",
          description: "Unknown section.",
          variant: "destructive"
        });
        return;
    }

    console.log("Payload to send:", payload);

    try {
      const endpointsToCall = Array.isArray(key) ? key : [key];
      for (const k of endpointsToCall) {
        console.log("Saving to endpoint:", endpoints[k]);
        const res = await fetch(endpoints[k], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Save failed (${res.status}): ${text}`);
        }
      }
      toast({
        title: "Saved successfully!",
        description: `${title} updated.`,
        duration: 2500,
      });
    } catch (err: any) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
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
              Locate the section of the data that must be adjusted.
              Current values will get prefilled upon entering an existing code or year in the lookup table.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 space-y-6 pb-8">
        {/* Salary Rates */}
        <SectionCard
          title="Salary Rates"
          description="Update a salary rate based on its code. Eg. 'FortnightProfessionalUOM 1.1' etc."
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
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRate(e.target.value),
              extra: currentRate !== null && !rateLoading
                ? <>Current FTE rate for <strong>{code}</strong>: ${currentRate.toLocaleString()}</>
                : null,
            },
          ]}
          onSave={() => handleSave("Salary Rates")}
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
              value: eba,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEba(e.target.value),
            },
            {
              label: "Salary Rate Multiplier",
              type: "input",
              placeholder: "Enter new salary rate multiplier (FTE)",
              value: salaryRateMultiplier,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSalaryRateMultiplier(e.target.value),
            },
          ]}
          onSave={() => handleSave("Multipliers")}
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
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStipendRate(e.target.value),
            },
            {
              label: "Payroll Tax",
              type: "input",
              placeholder: "Enter new payroll tax value as a decimal",
              value: payrollTax,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPayrollTax(e.target.value),
            },
          ]}
          onSave={() => handleSave("Employment Settings")}
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
            { label: "Superannuation Rate", type: "input", placeholder: "Enter super value as a percentage", value: superannuation, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSuperannuation(e.target.value) },
            { label: "Leave Loading", type: "input", placeholder: "Enter loading value as a percentage", value: leaveLoading, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLeaveLoading(e.target.value) },
            { label: "Work Cover", type: "input", placeholder: "Enter work cover industry rate", value: workCover, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setWorkCover(e.target.value) },
            { label: "Parental Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: parentalLeave, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setParentalLeave(e.target.value) },
            { label: "Long-Service Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: longServiceLeave, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLongServiceLeave(e.target.value) },
            { label: "Annual Leave", placeholder: "Enter weekly rate as a dollar amount", type: "input", value: annualLeave, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAnnualLeave(e.target.value) },
          ]}
          onSave={() => handleSave("Staff Benefits")}
        />
      </main>
    </div>
  );
}

/** ---------------- Section Card Component ---------------- */
function SectionCard({
  title,
  description,
  fields,
  onSave
}: {
  title: string;
  description?: string;
  fields: {
    label: string;
    value: any;
    onChange: any;
    extra?: any;
    type?: "input" | "select";
    placeholder?: string;
  }[];
    onSave: (title: string) => void;
}) {
  const colsClass = fields.length >= 8 ? "grid-cols-4" : fields.length >= 4 ? "grid-cols-4" : "grid-cols-3";
  const [values, setValues] = useState<Record<string, any>>({});

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
                value={f.value}
                onChange={f.onChange}
                type={f.type}
                placeholder={f.placeholder}
              />
              {f.extra && <div className="mt-1 text-xs text-gray-500">{f.extra}</div>}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-4 pt-1">
          <Button onClick={() => onSave(title)} className="bg-black text-white px-6">
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
