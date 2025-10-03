import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormNumberInputProps = {
  name: string;             // field key in the form data object
  label: string;            // label shown to user
  placeholder?: string;     // placeholder text
  message?: string;         // helper message bellow the input
  prefix?: string;          // optional prefix text inside the input
  control: any;             // the RHF "brain" controlling this field
};

export const FormNumberInput = ({ name, label, placeholder, message, prefix, control }: FormNumberInputProps) => (
  <FormField
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <FormControl>
            <Input
              {...field}
              type="number"
              placeholder={placeholder}
              className={prefix ? "pl-7" : ""}
              step="0.01" // allow decimals
              onChange={(e) => field.onChange(e.target.valueAsNumber)} // Convert to number
            />
          </FormControl>
        </div>
        <FormMessage>{message}</FormMessage>
      </FormItem>
    )}
  />
);