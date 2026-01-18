declare module 'clsx' {
  export type ClassValue = string | number | boolean | undefined | null | Record<string, any> | ClassValue[];
  export function clsx(...inputs: ClassValue[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: any[]): string;
}

declare module 'class-variance-authority' {
  export interface VariantProps<T> {
    variant?: T;
    size?: T;
  }
  export function cva(base: string, config: any): any;
  export type { VariantProps };
}

declare module 'lucide-react' {
  import { LucideIcon } from 'lucide-react';
  export * from 'lucide-react';
}