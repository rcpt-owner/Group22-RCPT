"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarIcon, XIcon, CheckIcon } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  name: string
  label: string
  placeholder?: string
  message?: string
  control: any
  minYear?: number
  maxYear?: number
  disabled?: boolean
  defaultValue?: string // "YYYY-MM"
}

/*
  UI choice: Dual Select dropdowns (month, year) inside a Popover.
  Rationale: Clear, compact, keyboard-friendly, and avoids showing day grids.
  Behavior:
  - Value stored as "YYYY-MM" (zero-padded month).
  - Popover closes automatically once both month and year are selected (or on Done).
  - Clear action to unset the value.
*/
export const FormMonthYearDateInput = ({
  name,
  label,
  placeholder,
  message,
  control,
  minYear: minYearProp,
  maxYear: maxYearProp,
  disabled,
  defaultValue,
}: Props) => {
  const currentYear = new Date().getFullYear()
  const minYear = minYearProp ?? currentYear - 5
  // Extend year range to 10 years in the future by default
  const maxYear = maxYearProp ?? currentYear + 10
  const [open, setOpen] = useState(false)

  const months = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ]

  const years = useMemo(() => {
    const from = Math.min(minYear, maxYear)
    const to = Math.max(minYear, maxYear)
    const arr: number[] = []
    for (let y = from; y <= to; y++) arr.push(y)
    return arr
  }, [minYear, maxYear])

  // Accept both "YYYY-MM" and "MM-YYYY" and return normalized parts
  function parse(value?: string): { year?: string; month?: string } {
    if (!value) return {}
    const yFirst = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/)
    if (yFirst) return { year: yFirst[1], month: yFirst[2] }
    const mFirst = value.match(/^(0[1-9]|1[0-2])-(\d{4})$/)
    if (mFirst) return { year: mFirst[2], month: mFirst[1] }
    return {}
  }

  function formatDisplay(value?: string): string {
    const { year, month } = parse(value)
    const m = months.find((mm) => mm.value === month)?.label
    if (m && year) return `${m} ${year}`
    return ""
  }

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const display = formatDisplay(field.value)
        const [localMonth, setLocalMonth] = useState<string | undefined>(parse(field.value).month)
        const [localYear, setLocalYear] = useState<string | undefined>(parse(field.value).year)

        // Apply defaultValue once if no value provided
        useEffect(() => {
          if (!field.value && defaultValue) {
            field.onChange(defaultValue)
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        // Sync local selectors when opening the popover
        useEffect(() => {
          if (open) {
            const p = parse(field.value || defaultValue)
            setLocalMonth(p.month)
            setLocalYear(p.year)
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [open])

        const commitIfComplete = (m?: string, y?: string) => {
          if (m && y) {
            field.onChange(`${y}-${m}`)
            setOpen(false)
          }
        }

        const onChangeMonth = (m: string) => {
          setLocalMonth(m)
          commitIfComplete(m, localYear)
        }
        const onChangeYear = (y: string) => {
          setLocalYear(y)
          commitIfComplete(localMonth, y)
        }
        const onClear = () => {
          setLocalMonth(undefined)
          setLocalYear(undefined)
          field.onChange("")
          setOpen(false)
        }

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setOpen(true)
                      }
                      if (e.key === "Escape") setOpen(false)
                    }}
                  >
                    <span className={display ? "" : "text-muted-foreground"}>
                      {display || placeholder || "Select month"}
                    </span>
                    <CalendarIcon aria-hidden="true" className="ml-2 size-4 opacity-70" />
                    <span className="sr-only">Choose month and year</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-3" align="start">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-1">
                      <label className="mb-1 block text-xs text-muted-foreground">Month</label>
                      <Select
                        value={localMonth}
                        onValueChange={onChangeMonth}
                        disabled={disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <label className="mb-1 block text-xs text-muted-foreground">Year</label>
                      <Select
                        value={localYear}
                        onValueChange={onChangeYear}
                        disabled={disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        {/* Make the year list scrollable */}
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onClear}
                      disabled={disabled || !field.value}
                    >
                      <XIcon className="mr-1 size-4" />
                      Clear
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (localMonth && localYear) {
                            field.onChange(`${localYear}-${localMonth}`)
                          }
                          setOpen(false)
                        }}
                        disabled={disabled}
                      >
                        <CheckIcon className="mr-1 size-4" />
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage>{message}</FormMessage>
          </FormItem>
        )
      }}
    />
  )
}
