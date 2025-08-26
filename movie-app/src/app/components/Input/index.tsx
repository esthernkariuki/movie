
import { cn } from "@/app/utils/utils";
import * as React from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
        customProp?: boolean;
     }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, customProp, ...props }, ref) => {
    const customClass = customProp ? "border-red-500" : "";
    Input.displayName = "Input";

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          customClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Input };
