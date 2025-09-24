import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogDemo } from "@/components/AlertDialogDemo";
import { DialogDemo } from "@/components/DialogDemo";
import { Badge } from "lucide-react";
import { BadgeDemo } from "@/components/BadgeDemo";
import { NavigationMenuDemo } from "@/components/NavigationMenuDemo";

/*  Placeholder component for the Research Costing Tool. Replace with actual implementation. 
    Use this to test styling and layout within the components.
*/


export function ResearchCostingTool() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      
      

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <Alert variant="destructive">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the cli.
        </AlertDescription>
      </Alert>


      <AlertDialogDemo />
      <DialogDemo />
      <BadgeDemo />

      
    </div>
  );
}

