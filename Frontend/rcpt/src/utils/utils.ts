// utils.ts

// Utility to conditionally join class names
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
// Example usage: cn("class1", condition && "class2", "class3")