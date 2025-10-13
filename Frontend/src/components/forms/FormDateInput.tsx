import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormDateInputProps = {
  name: string;             // field key in the form data object
  label: string;            // label shown to user
  placeholder?: string;     // placeholder text
  message?: string;         // helper message bellow the input
  control: any;             // the RHF "brain" controlling this field
};

export const FormDateInput = ({ name, label, placeholder, message, control }: FormDateInputProps) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="date"
            placeholder={placeholder}
          />
        </FormControl>
        <FormMessage>{message}</FormMessage>
      </FormItem>
    )}
  />
);