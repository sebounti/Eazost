import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        primary: "bg-amber-500 text-white hover:bg-amber-600",
        secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);
