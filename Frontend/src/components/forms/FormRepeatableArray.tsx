import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormTextInput } from "./FormTextInput";

type FieldConfig = {
  name: string;             // Field key in the form data object
  label: string;            // Label shown to the user
  placeholder?: string;     // Placeholder text
};

type FormRepeatableArrayProps = {
  name: string;             // Field key for the array in the form data object
  label: string;            // Label for the entire array
  control: any;             // RHF control object
  fields: FieldConfig[];    // Configuration for fields in each array entry
  defaultEntry: Record<string, any>; // Default values for new entries
};

export const FormRepeatableArray = ({
  name,
  label,
  control,
  fields,
  defaultEntry,
}: FormRepeatableArrayProps) => {
  const { fields: arrayFields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      <h3 className="text-lg font-medium">{label}</h3>
      {arrayFields.map((field, index) => (
        <div key={field.id} className="flex flex-col space-y-4 mb-4">
          {fields.map(({ name: fieldName, label, placeholder }) => (
            <FormTextInput
              key={fieldName}
              name={`${name}.${index}.${fieldName}`}
              label={label}
              placeholder={placeholder}
              control={control}
            />
          ))}
          <Button variant="destructive" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button onClick={() => append(defaultEntry)}>Add Entry</Button>
    </div>
  );
};