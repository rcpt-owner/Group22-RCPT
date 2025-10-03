import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Props for the FormTextInput component

type TextInputProps = {
  name: string;             // field key in the form data object
  label: string;            // label shown to user
  placeholder?: string;     // placeholder text
  message?: string;         // helper message bellow the input
  control: any;             // the RHF "brain" controlling this field
};

export const FormTextInput = ({
  name,
  label,
  placeholder,
  message,
  control,
}: TextInputProps) => (
  <FormField
    control={control}         // connect to RHF state manager
    name={name}               // register this field under that name
    render={({ field }) => ( // field = hooks to read/write state
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} placeholder={placeholder} />
        </FormControl>
        <FormMessage>{message}</FormMessage>
      </FormItem>
    )}
  />
);
