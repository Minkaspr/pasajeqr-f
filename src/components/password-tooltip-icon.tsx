import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Info } from "lucide-react";

export function PasswordTooltipIcon() {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 5000); // cierra en 5s
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Info
            className="h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
        </TooltipTrigger>
        <TooltipContent
          className="text-xs max-w-xs bg-white outline text-black p-2 rounded shadow-md"
        >
          La contraseña debe contener:
          <ul className="list-disc list-inside mt-1">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una letra mayúscula</li>
            <li>Al menos una letra minúscula</li>
            <li>Al menos un número</li>
            <li>
              Al menos un símbolo: <code>@ # $ % * _ -</code>
            </li>
          </ul>
          
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
