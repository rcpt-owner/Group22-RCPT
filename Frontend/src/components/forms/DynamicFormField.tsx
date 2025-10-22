import type { FieldDefinition } from "@/types/FormSchema"
import { FormTextInput } from "./FormTextInput"
import { FormTextArea } from "./FormTextArea"
import { FormNumberInput } from "./FormNumberInput"
import { FormDateInput } from "./FormDateInput"
import { FormSelect } from "./FormSelect"
import { FormCheckbox } from "./FormCheckbox"
import { FormRepeatableArray } from "./FormRepeatableArray"
import { FormMonthYearDateInput } from "./FormMonthYearDateInput"
import { rcptEngine } from "@/features/RCPT/rcptEngine"

/*
  DynamicFormField: single authoritative renderer for a JSON field definition.
  Provides:
  - Uniform wrapper for styling & layout hooks
  - data attributes for theming / analytics / testing
  - Central place to extend (conditional visibility, permissions, tooltips, etc.)
*/

type DynamicFormFieldProps = {
  field: FieldDefinition
  control: any
  nameOverride?: string 
  projectId?: string // projectId for dynamic years
}

export const FieldForm = ({ field, control, nameOverride, projectId }: DynamicFormFieldProps) => {
  const resolvedName = nameOverride || field.name
  const commonProps = {
    control,
    name: resolvedName,
    label: field.label,
    placeholder: field.placeholder,
    message: field.message,
  }

  let rendered: React.ReactNode = null
  switch (field.type) {
    case "dynamic_years":
      // Get project years from rcptEngine
      const years = rcptEngine.getProjectYears(projectId)
      rendered = (
      <div className="flex flex-col gap-2">
        {years.map(year => (
          <FormNumberInput
            key={year}
            control={control}
            name={`years.${year}`}
            label={year}
            placeholder={`Enter amount for ${year}`}
          />
        ))}
        </div>
      )
      break
    case "text":
      rendered = <FormTextInput {...commonProps} />
      break
    case "textarea":
      rendered = <FormTextArea {...commonProps} />
      break
    case "number":
      rendered = <FormNumberInput {...commonProps} prefix={field.prefix} />
      break
    case "date":
      rendered = <FormDateInput {...commonProps} />
      break
    case "monthYearDate":
      rendered = (
        <FormMonthYearDateInput
          {...commonProps}
          minYear={field.minYear}
          maxYear={field.maxYear}
          disabled={field.disabled}
          defaultValue={field.defaultValue}
        />
      )
      break
    case "select":
      rendered = <FormSelect {...commonProps} options={field.options || []} />
      break
    case "checkbox":
      rendered = <FormCheckbox {...commonProps} />
      break
    case "repeatable":
      rendered = (
        <FormRepeatableArray
          control={control}
          name={resolvedName}
          label={field.label}
          fields={(field.fields || []) as any}
          defaultEntry={field.defaultEntry || {}}
        />
      )
      break
    default:
      rendered = null
  }

  return (
    <div
      className="field-form-wrapper"
      data-field={field.name}
      data-path={resolvedName}
      data-type={field.type}
      role="group"
      aria-labelledby={`field-${resolvedName}`}
    >
      {rendered}
    </div>
  )
}
