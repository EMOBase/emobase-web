import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/classname";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-8", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="border-b border-slate-200">
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn("flex gap-8 -mb-px", className)}
        {...props}
      />
    </div>
  );
}

function TabsTrigger({
  className,
  children,
  badge,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  badge?: number;
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group/trigger whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-all border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 data-[state=active]:border-primary data-[state=active]:text-primary",
        className,
      )}
      {...props}
    >
      {children}
      {badge !== undefined && (
        <span
          className={
            "py-0.5 px-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 group-data-[state=active]/trigger:bg-orange-100 group-data-[state=active]/trigger:text-primary"
          }
        >
          {badge}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
