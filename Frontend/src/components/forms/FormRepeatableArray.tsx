import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { FieldDefinition } from "@/types/FormSchema";
import { FieldForm } from "./DynamicFormField";
import { useMemo } from "react";

type LegacyFieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: FieldDefinition["type"]; // optional in legacy usage
  options?: { value: string; label: string }[];
  prefix?: string;
};

type FormRepeatableArrayProps = {
  name: string; // Field key for the array in the form data object
  label: string; // Label for the entire array
  control: any; // RHF control object
  fields: (FieldDefinition | LegacyFieldConfig)[]; // accept both
  defaultEntry: Record<string, any>; // Default values for new entries
};

export const FormRepeatableArray = ({
  name,
  label,
  control,
  fields,
  defaultEntry,
}: FormRepeatableArrayProps) => {
  // Normalize to full FieldDefinition with default type "text"
  const normalizedFields = useMemo(
    () =>
      fields.map(f => ({
        // spread first so explicit type in legacy object not lost
        ...f,
        type: (f as any).type ?? "text",
      })) as FieldDefinition[],
    [fields]
  );

  const { fields: arrayFields, append, remove } = useFieldArray({ control, name });

  return (
    <div data-repeatable={name}>
      <h3 className="text-lg font-medium mb-2">{label}</h3>
      {arrayFields.map((row, index) => (
        <div
          key={row.id}
          className="flex flex-col space-y-4 mb-4 rounded-md border p-4"
          data-repeatable-index={index}
        >
          {normalizedFields.map(child => (
            <FieldForm
              key={child.name}
              field={child}
              control={control}
              nameOverride={`${name}.${index}.${child.name}`} // override nested path
            />
          ))}
          <Button
            variant="destructive"
            type="button"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append(defaultEntry)}>
        Add Entry
      </Button>
    </div>
  );
};