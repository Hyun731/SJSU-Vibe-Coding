import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  author: string;
  coverColor: string;
  coverPattern?: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

// Simple decorative SVG patterns for the book cover
const PATTERNS = [
  // Diagonal lines
  <pattern id="p0" key="p0" width="10" height="10" patternUnits="userSpaceOnUse">
    <line x1="0" y1="10" x2="10" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
  </pattern>,
  // Dots
  <pattern id="p1" key="p1" width="8" height="8" patternUnits="userSpaceOnUse">
    <circle cx="4" cy="4" r="1.2" fill="rgba(255,255,255,0.14)" />
  </pattern>,
  // Cross-hatch
  <pattern id="p2" key="p2" width="12" height="12" patternUnits="userSpaceOnUse">
    <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
  </pattern>,
  // Waves
  <pattern id="p3" key="p3" width="20" height="8" patternUnits="userSpaceOnUse">
    <path d="M0 4 Q5 0 10 4 Q15 8 20 4" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
  </pattern>,
];

const SIZE_CONFIG = {
  xs: { width: 40, height: 56, titleSize: "text-[5px]", authorSize: "text-[4px]", spineWidth: 6 },
  sm: { width: 64, height: 88, titleSize: "text-[7px]", authorSize: "text-[5px]", spineWidth: 8 },
  md: { width: 96, height: 136, titleSize: "text-[9px]", authorSize: "text-[7px]", spineWidth: 12 },
  lg: { width: 128, height: 180, titleSize: "text-[11px]", authorSize: "text-[9px]", spineWidth: 16 },
};

export function BookCover({ title, author, coverColor, coverPattern = 0, size = "md", className }: BookCoverProps) {
  const cfg = SIZE_CONFIG[size];
  const patternId = `pat-${title.slice(0, 4)}-${coverPattern}`;

  return (
    <div className={cn("relative flex-shrink-0 rounded-sm overflow-hidden shadow-md", className)} style={{ width: cfg.width, height: cfg.height }}>
      <svg width={cfg.width} height={cfg.height} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          {coverPattern === 0 && (
            <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="10" x2="10" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            </pattern>
          )}
          {coverPattern === 1 && (
            <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.2" fill="rgba(255,255,255,0.14)" />
            </pattern>
          )}
          {coverPattern === 2 && (
            <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          )}
          {coverPattern === 3 && (
            <pattern id={patternId} width="20" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4 Q5 0 10 4 Q15 8 20 4" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
            </pattern>
          )}
        </defs>

        {/* Background */}
        <rect width={cfg.width} height={cfg.height} fill={coverColor} />
        {/* Pattern overlay */}
        <rect width={cfg.width} height={cfg.height} fill={`url(#${patternId})`} />
        {/* Spine shadow */}
        <rect width={cfg.spineWidth} height={cfg.height} fill="rgba(0,0,0,0.2)" />
        {/* Top band */}
        <rect y={0} width={cfg.width} height={cfg.height * 0.07} fill="rgba(255,255,255,0.15)" />
        {/* Bottom band */}
        <rect y={cfg.height * 0.93} width={cfg.width} height={cfg.height * 0.07} fill="rgba(0,0,0,0.2)" />
      </svg>

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-2 text-center">
        <p
          className={cn("font-bold leading-tight text-white drop-shadow", cfg.titleSize)}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
        >
          {title.length > 30 ? title.slice(0, 28) + "…" : title}
        </p>
        <p
          className={cn("mt-1 text-white/80 leading-tight", cfg.authorSize)}
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          {author}
        </p>
      </div>
    </div>
  );
}
