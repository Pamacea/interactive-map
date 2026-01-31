"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "iron" | "blood";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const CrownButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gold", size = "md", href, children, className = "", onClick, ...props }, ref) => {
    const router = useRouter();

    const baseStyles = "relative inline-flex items-center justify-center gap-2 font-display tracking-wider transition-all duration-300 border cursor-pointer";

    const variantStyles = {
      gold: "bg-transparent border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-void hover:shadow-lg shadow-accent-gold/20",
      iron: "bg-transparent border-iron text-bone hover:border-accent-gold hover:text-accent-gold hover:shadow-lg shadow-accent-gold/10",
      blood: "bg-transparent border-blood text-bone hover:bg-blood hover:text-bone-dark hover:shadow-lg shadow-blood/20",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (href) {
        e.preventDefault();
        router.push(href);
      }
      onClick?.(e);
    };

    const buttonElement = (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );

    return buttonElement;
  }
);

CrownButton.displayName = "CrownButton";
