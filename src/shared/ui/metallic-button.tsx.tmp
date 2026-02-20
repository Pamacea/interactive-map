import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils";
import { SkeletonSpinner } from "@/shared/ui/skeleton";

interface MetallicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "silver" | "bronze";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function MetallicButton({
  variant = "gold",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: MetallicButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-display font-semibold tracking-wide transition-all duration-225 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[0px] active:scale-[0.99]";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const variantStyles = {
    gold: "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40",
    silver: "bg-gradient-to-r from-slate-400 via-gray-300 to-slate-400 text-black hover:from-slate-300 hover:via-gray-200 hover:to-slate-300 shadow-lg shadow-slate-400/25 hover:shadow-xl hover:shadow-slate-400/40",
    bronze: "bg-gradient-to-r from-orange-700 via-amber-600 to-orange-700 text-black hover:from-orange-600 hover:via-amber-500 hover:to-orange-600 shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/40",
  };



  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        "overflow-hidden",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-225 pointer-events-none translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500" />
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <SkeletonSpinner size="sm" />}
        {children}
      </span>
    </button>
  );
}
