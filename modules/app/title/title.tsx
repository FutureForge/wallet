import { cn } from "@/modules/utils";
import React from "react";

export function Title({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2 className={cn("text-2xl font-medium font-inter mb-4", className)}>{title}</h2>
  );
}
