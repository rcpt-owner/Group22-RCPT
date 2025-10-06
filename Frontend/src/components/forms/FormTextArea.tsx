import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type FormTextAreaProps = {
  name: string;             // field key in the form data object
  label: string;            // label shown to user
  placeholder?: string;     // placeholder text
  message?: string;         // helper message bellow the input
  control: any;             // the RHF "brain" controlling this field
};

export const FormTextArea = ({ name, label, placeholder, message, control }: FormTextAreaProps) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...field} placeholder={placeholder} />
        </FormControl>
        <FormMessage>{message}</FormMessage>
      </FormItem>
    )}
  />
);