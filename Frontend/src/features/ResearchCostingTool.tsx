import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogDemo } from "@/components/demos/AlertDialogDemo";
import { DialogDemo } from "@/components/demos/DialogDemo";
import { BadgeDemo } from "@/components/demos/BadgeDemo";
import { CheckboxDemo } from "@/components/demos/CheckboxDemo";
import { DatePickerWithInput } from "@/components/DatePickerWithInput";
import { RadioGroupDemo } from "@/components/demos/RadioGroupDemo";
import { ScrollAreaDemo } from "@/components/demos/ScrollAreaDemo";
import { SelectDemo } from "@/components/demos/SelectDemo";
import { SonnerDemo } from "@/components/demos/SonnerDemo";
import { SwitchDemo } from "@/components/demos/SwitchDemo";
import { TabsDemo } from "@/components/demos/TabsDemo";
import { TextareaWithText } from "@/components/demos/TextAreaDemo";
import { ProjectFormDemo } from "@/components/demos/ProjectFormDemo";


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

      <CheckboxDemo />

      <DatePickerWithInput />

      <RadioGroupDemo />

      <ScrollAreaDemo />

      <SelectDemo />

      <SonnerDemo />

      < SwitchDemo />

      <TabsDemo />

      <TextareaWithText />

      <ProjectFormDemo />

    </div>
  );
}

