// NOTE: This page is no longer part of top-level navigation (login → dashboard → workspace).
// It can be linked internally if needed for UI reference.

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogDemo } from "@/components/demos/AlertDialogDemo"
import { DialogDemo } from "@/components/demos/DialogDemo"
import { BadgeDemo } from "@/components/demos/BadgeDemo"
import { CheckboxDemo } from "@/components/demos/CheckboxDemo"
import { DatePickerWithInput } from "@/components/DatePickerWithInput"
import { RadioGroupDemo } from "@/components/demos/RadioGroupDemo"
import { ScrollAreaDemo } from "@/components/demos/ScrollAreaDemo"
import { SelectDemo } from "@/components/demos/SelectDemo"
import { SonnerDemo } from "@/components/demos/SonnerDemo"
import { SwitchDemo } from "@/components/demos/SwitchDemo"
import { TabsDemo } from "@/components/demos/TabsDemo"
import { TextareaWithText } from "@/components/demos/TextAreaDemo"
import { ProjectFormDemo } from "@/components/demos/ProjectFormDemo"

export function DemoShowcasePage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Component Showcase</CardTitle>
          <CardDescription>Original demo components migrated into their own page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              These demos are for UI exploration and are isolated from workspace routing.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-4 items-start">
            <AlertDialogDemo />
            <DialogDemo />
            <BadgeDemo />
            <CheckboxDemo />
            <DatePickerWithInput />
            <RadioGroupDemo />
            <ScrollAreaDemo />
            <SelectDemo />
            <SonnerDemo />
            <SwitchDemo />
            <TabsDemo />
            <TextareaWithText />
          </div>

          <div>
            <h3 className="font-medium mb-2">Project Form (Demo)</h3>
            <ProjectFormDemo />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">End of showcase.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
