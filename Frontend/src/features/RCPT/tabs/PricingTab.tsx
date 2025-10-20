import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "../../../components/stats/StatsCard";
import { rcptEngine } from "../rcptEngine"; 
import { Scale } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

const PricingTab: React.FC<{ projectId: string }> = ({ projectId }) => {
  // Demo data from rcptEngine (replace with actual calculations)
  const staffTotal = rcptEngine.getTotalStaffCosts(projectId); 
  const nonStaffTotal = rcptEngine.getTotalNonStaffCosts(projectId); 
  const multiplier = 1.5;  // NEED TO GET FROM SERVICES LATER
  const multiplierCost = rcptEngine.getMultiplierCost(projectId, multiplier);
  const totalCosts = staffTotal + nonStaffTotal + multiplierCost;
  const inKindCostTotal = rcptEngine.getInKindCostTotal(projectId);
  const totalPricing = rcptEngine.getTotalPricing(projectId);

  const [nonStaffCosts, setNonStaffCosts] = useState(rcptEngine.getNonStaffCosts(projectId));

  useEffect(() => {
    const unsubscribe = rcptEngine.subscribe(projectId, () => {
      setNonStaffCosts(rcptEngine.getNonStaffCosts(projectId));
    });
    return unsubscribe;
  }, [projectId]);

  const handleInKindChange = (index: number, inKind: boolean) => {
    const updated = nonStaffCosts.map((item, i) => i === index ? { ...item, inKind } : item);
    setNonStaffCosts(updated);
    rcptEngine.setNonStaffCosts(projectId, updated);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Section: Costs */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 " />
            <CardTitle>Costs Stats</CardTitle>
          </div>
          <CardDescription>
            A summary of the project, its costs and the pricing available.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Staff Costs"
              value={`$${staffTotal.toLocaleString()}`}
              subText="Includes all staff-related expenses."
            />
            <StatsCard
              title="Total Non-Staff Costs"
              value={`$${nonStaffTotal.toLocaleString()}`}
              subText="Includes equipment, supplies, etc."
            />
            <StatsCard
              title="Multiplier Cost"
              value={`$${multiplierCost.toLocaleString()}`}
              subText={`Additional cost from ${multiplier}x multiplier.`}
            />
            <StatsCard
              title="Total Costs"
              value={`$${totalCosts.toLocaleString()}`}
              subText="Sum of staff, non-staff, and multiplier costs."
            />
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
       {/* Top Section: pricing */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 " />
            <CardTitle>Pricing</CardTitle>
          </div>
          <CardDescription>
            This represents the actual price of the project, which will be what is paid. 
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard
              title="In-Kind Cost Total"
              value={`$${inKindCostTotal.toLocaleString()}`}
              subText="Total value of in-kind contributions."
            />
            <StatsCard
              title="Total Pricing"
              value={`$${totalPricing.toLocaleString()}`}
              subText="Total costs minus in-kind contributions."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Non-Staff Costs Adjustment</CardTitle>
          <CardDescription>Edit in-kind status for non-staff costs to adjust pricing.</CardDescription>
        </CardHeader>

        {/* Table of Non-Staff Costs with In-Kind Checkbox */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>In-Kind</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonStaffCosts.map((item, index) => {
                const total = item.year1 + item.year2 + item.year3;
                return (
                  <TableRow key={index}>
                    <TableCell>{item.description || item.subcategory || item.category}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={item.inKind}
                        onCheckedChange={(checked) => handleInKindChange(index, !!checked)}
                      />
                    </TableCell>
                    <TableCell>${total.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default PricingTab;