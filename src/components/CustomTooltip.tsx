// src/components/CustomTooltip.tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomTooltipProps {
  children: React.ReactNode; // L'élément enfant (trigger du tooltip)
  message: string; // Le message d'erreur ou info affiché dans le tooltip
  className?: string; // Optionnel pour personnaliser le style de l'élément déclencheur
}

export default function CustomTooltip({ children, message, className }: CustomTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={className}>
          {children} {/* Élément déclencheur */}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white p-2 rounded shadow-lg">
        {message} {/* Message d'erreur */}
      </TooltipContent>
    </Tooltip>
  );
}
