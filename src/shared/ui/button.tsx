import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)]
          text-[var(--color-background-base)]
          font-display font-semibold tracking-wide
          hover:scale-105
          active:scale-100
        `,
        secondary: `
          bg-[var(--color-background-card)]
          text-[var(--color-text-primary)]
          font-display
          border border-[var(--color-border-ornate)]
          hover:bg-[var(--color-background-card-hover)]
        `,
        ghost: `
          text-[var(--color-text-secondary)]
          hover:text-[var(--color-accent-gold)]
          hover:bg-[var(--color-background-card-hover)]
        `,
        outline: `
          bg-transparent
          text-[var(--color-accent-gold)]
          border-2 border-[var(--color-accent-gold)]
          hover:bg-[rgb(212_175_55/0.1)]
        `,
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-6 py-3",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
