"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormItem,
} from "@/components/ui/form"
import { Card } from "../ui/card"
import { FormTextInput } from "@/components/forms/FormTextInput"
import { FormTextArea } from "../forms/FormTextArea"
import { FormSelect } from "../forms/FormSelect"
import { FormCheckbox } from "../forms/FormCheckbox"
import { FormNumberInput } from "../forms/FormNumberInput"
import { FormDateInput } from "../forms/FormDateInput"

// Project form demo using React Hook Form and Zod for validation

// 1. Define a Zod schema for validation
const ProjectFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  "mini-description": z.string().optional(),
  description: z.string().optional(),
  category: z.string().nonempty({ message: "Category is required." }),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms and conditions." }),
  budget: z
  .number({ invalid_type_error: "Budget must be a number" })
  .min(0, { message: "Budget must be a positive number." })
  .optional()
  .refine((val) => val === undefined || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
    message: "Budget can have at most 2 decimal places.",
  }), 
  deadline: z.string().optional(), // date as ISO string
})

// 2. Infer TypeScript types from Zod schema
type ProjectFormValues = z.infer<typeof ProjectFormSchema>

export const ProjectFormDemo = () => {
  // 3. Initialize RHF with Zod resolver
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: "",
      "mini-description": "",
      description: "",
      category: "",
    },
  })

  // 4. Submit handler
  const onSubmit = (values: ProjectFormValues) => {
    // TODO: replace with context update or API call
    console.log("Project form submitted:", values)
  }

  return (
    <Card className="w-2/3 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormTextInput
            control={form.control}
            name="title"
            label="Project Title"
            placeholder="My Research Tool"
            message="A short, descriptive title"
          />
          <FormTextInput
            control={form.control}
            name="mini-description"
            label="Mini Description"
            placeholder="Brief project summary"
            message="A short, descriptive summary of the project"
          />
          <FormTextArea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Description of the project"
            message="Descriptive summary of the project"
          />
          <FormSelect
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select a category"
            message="Select a category for the project"
            options={[
              { value: "research", label: "Research" },
              { value: "development", label: "Development" },
              { value: "design", label: "Design" },
            ]}
          />
          <FormCheckbox
            control={form.control}
            name="terms"
            label="I agree to the terms and conditions"
            message="You must agree before submitting"
          />
          <FormNumberInput
            control={form.control}
            name="budget"
            label="Project Budget"
            placeholder="Enter budget"
            message="Enter the budget for the project"
            prefix="$"
          />
          <FormDateInput
            control={form.control} 
            name="deadline"
            label="Deadline"
            placeholder="Select a deadline"
            message="Select the project deadline"
          /> 
          <FormItem>
            <Button type="submit">Submit Project</Button>
          </FormItem>
        </form>
      </Form>
    </Card>
  )
}
