import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative clay-card flex items-center justify-center", sizes[size])}>
        <svg viewBox="0 0 40 40" className="w-3/4 h-3/4">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(230, 70%, 55%)" />
              <stop offset="100%" stopColor="hsl(280, 60%, 65%)" />
            </linearGradient>
          </defs>
          <circle cx="14" cy="14" r="6" fill="url(#logoGrad)" opacity="0.8" />
          <circle cx="26" cy="14" r="6" fill="url(#logoGrad)" opacity="0.6" />
          <circle cx="20" cy="26" r="6" fill="url(#logoGrad)" opacity="0.9" />
          <path d="M14 14 L26 14 L20 26 Z" fill="url(#logoGrad)" opacity="0.3" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold gradient-text", textSizes[size])}>
          SynergySphere
        </span>
      )}
    </div>
  );
};

export default Logo;
