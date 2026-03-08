import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EspadaBadgeProps {
  type: "admin" | "pro-creator";
  size?: number;
  className?: string;
}

export function EspadaBadge({
  type,
  size = 24,
  className = "",
}: EspadaBadgeProps) {
  const isAdmin = type === "admin";
  const src = isAdmin
    ? "/assets/generated/badge-admin-transparent.dim_120x120.png"
    : "/assets/generated/badge-pro-youtuber-transparent.dim_120x120.png";

  const label = isAdmin ? "ESPADA Admin" : "Pro Creator";
  const tooltipClass = isAdmin
    ? "bg-[oklch(0.15_0.04_265)] border border-[oklch(0.6_0.22_255/0.5)] text-[oklch(0.75_0.22_255)] font-display font-semibold text-xs"
    : "bg-[oklch(0.15_0.04_265)] border border-[oklch(0.63_0.26_25/0.5)] text-[oklch(0.78_0.22_25)] font-display font-semibold text-xs";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <img
            src={src}
            alt={label}
            width={size}
            height={size}
            className={`inline-block object-contain drop-shadow-lg ${className}`}
            style={{ width: size, height: size }}
          />
        </TooltipTrigger>
        <TooltipContent className={tooltipClass}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
