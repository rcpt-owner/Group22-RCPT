import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/utils/cn"

interface TabBarProps {
  tabs: string[]
  selected: string
  onChange: (tab: string) => void
  className?: string
}

/*
  TabBar (shadcn + Radix Tabs)
  - Controlled component: parent owns `selected` + `onChange`.
  - Uses a Tabs root internally so Radix handles a11y & roving focus.
  - Only renders triggers (no content panels) to match previous usage pattern.
  - Centered pill style; inactive/active states styled with data attributes.
  - If you later need to co-locate <TabsContent>, either:
      (1) Lift the Tabs root to parent and inline <TabsList>/<TabsTrigger> there, or
      (2) Extend this component to accept `children` and render them after the list.
*/
export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  selected,
  onChange,
  className
}) => {
  return (
    <Tabs
      value={selected}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList
        className={cn(
          "mx-auto flex w-max gap-2 rounded-full bg-muted/40 p-1",
          "border border-border/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30"
        )}
      >
        {tabs.map(t => (
          <TabsTrigger
            key={t}
            value={t}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition",
              "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            )}
          >
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
