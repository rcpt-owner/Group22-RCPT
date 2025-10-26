import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type FormCheckboxProps = {
  name: string;             // field key in the form data object
  label: string;            // label shown to user
  message?: string;         // helper message bellow the input
  control: any;             // the RHF "brain" controlling this field
};

export const FormCheckbox = ({ name, label, message, control }: FormCheckboxProps) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FormLabel>{label}</FormLabel>
          </div>
        </FormControl>
        <FormMessage> {message} </FormMessage>
      </FormItem>
    )}
  />
);