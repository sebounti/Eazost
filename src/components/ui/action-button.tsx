'use client';

import { Loader2 } from "lucide-react";
import { Button } from "./button";

interface ActionButtonProps {
  loading?: boolean;
  icon: React.ReactNode;
  variant?: "default" | "outline" | "disabled";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const ActionButton = ({
  loading = false,
  icon,
  variant = "default",
  children,
  onClick,
  disabled = false,
}: ActionButtonProps) => {
  const baseStyles = "w-full px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 rounded-xl";
  const variantStyles = {
    default: "bg-amber-500 text-gray-700 hover:bg-amber-400",
    outline: "bg-amber-200 border border-slate-300 text-gray-700 hover:bg-slate-50",
    disabled: "bg-amber-200 border-2 border-amber-200 text-gray-400"
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {loading ? <Loader2 className="text-xl animate-spin" /> : icon}
      {children}
    </Button>
  );
};
