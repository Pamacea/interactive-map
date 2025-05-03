import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants
        header:
          "justify-center rounded-none gap-2 bg-transparent  border-l-2 border-border uppercase font-bold tracking-widest text-sm lg:text-lg hover:bg-accent/50 hover:border-b cursor-pointer",
        btnheader:
          "rounded-none gap-2 bg-transparent border-l-2 border-border uppercase font-bold tracking-widest hover:bg-accent/50 hover:border-b cursor-pointer",
        tab: "flex items-center justify-center rounded-none  uppercase font-bold tracking-widest font-grenze text-sm lg:text-lg hover:bg-accent/50 cursor-pointer",
      },
      size: {
        none: "w-0 px-0 py-0 gap-0",
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        header: "h-12 rounded-none gap-2 px-4 has-[>svg]:px-3",
        btnheader: "h-12 rounded-none gap-2 px-4 has-[>svg]:px-3",
        maintab: "h-9 w-1/3 rounded-none gap-2 px-4 has-[>svg]:px-3",
        tab: "h-9 w-1/4 rounded-none gap-2 px-4 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-x",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  const isHeader = variant === "header";
  const isBtnHeader = variant === "btnheader";
  const isTab = variant === "tab";

  let buttonClass;
  if (isHeader) {
    buttonClass = cn(buttonVariants({ variant: "header", size }));
  } else if (isTab) {
    buttonClass = cn(buttonVariants({ variant: "tab", size }));
  } else if (isBtnHeader) {
    buttonClass = cn(buttonVariants({ variant: "btnheader", size }));
  } else {
    buttonClass = cn(buttonVariants({ variant, size }), className);
  }

  return <Comp data-slot="button" className={buttonClass} {...props} />;
}

export { Button, buttonVariants };
