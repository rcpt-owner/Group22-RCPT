import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Home, Bell, Settings } from "lucide-react";

export function AdminSettingsPage({ onLogout, userId, onEnterWorkspace }: AdminSettingsProps) {
  const navigate = useNavigate();
  const [lookupData, setLookupData] = useState({});
  const [salaryRates, setSalaryRates] = useState({});
  const [multipliers, setMultipliers] = useState({});
  const [leaveSettings, setLeaveSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setLookupData(data.lookupData);
        setSalaryRates(data.salaryRates);
        setMultipliers(data.multipliers);
        setLeaveSettings(data.leaveSettings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 🔹 Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b shadow-sm bg-background">
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
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate("/adminSettings")}
            title="Admin Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* 🔹 Header Admin Settings Card (matching Export tab spacing) */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border rounded-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6" />
              <CardTitle>Admin Settings</CardTitle>
            </div>
            <CardDescription>
              Locate the section of the data that must be adjusted and enter the new values.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 🔹 Main Content Area (matching Export tab) */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Lookup Table Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Lookup Table Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(lookupData).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <label htmlFor={key} className="font-medium">{key}</label>
                  <Select
                    value={lookupData[key]}
                    onValueChange={(value) => setLookupData({ ...lookupData, [key]: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue>{lookupData[key]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Option 1">Option 1</SelectItem>
                      <SelectItem value="Option 2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Salary Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(salaryRates).map((rateKey) => (
                <div key={rateKey} className="flex items-center justify-between">
                  <label htmlFor={rateKey} className="font-medium">{rateKey}</label>
                  <Input
                    type="number"
                    value={salaryRates[rateKey]}
                    onChange={(e) => setSalaryRates({ ...salaryRates, [rateKey]: e.target.value })}
                    className="w-32"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Multipliers */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Multipliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(multipliers).map((multiplierKey) => (
                <div key={multiplierKey} className="flex items-center justify-between">
                  <label htmlFor={multiplierKey} className="font-medium">{multiplierKey}</label>
                  <Input
                    type="number"
                    value={multipliers[multiplierKey]}
                    onChange={(e) => setMultipliers({ ...multipliers, [multiplierKey]: e.target.value })}
                    className="w-32"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave and Employment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Leave and Employment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(leaveSettings).map((leaveKey) => (
                <div key={leaveKey} className="flex items-center justify-between">
                  <label htmlFor={leaveKey} className="font-medium">{leaveKey}</label>
                  <Input
                    type="number"
                    value={leaveSettings[leaveKey]}
                    onChange={(e) => setLeaveSettings({ ...leaveSettings, [leaveKey]: e.target.value })}
                    className="w-32"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-[#4B2E83] text-white">Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
}