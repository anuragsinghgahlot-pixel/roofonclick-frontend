"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ChartData, ChartDataPoint } from "@/services/admin-dashboard";

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, duration: number = 1200) {
  const [current, setCurrent] = React.useState(0);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

/* ─── Mini Sparkline (SVG) ─── */
function Sparkline({
  data,
  color,
  height = 40,
  className,
}: {
  data: number[];
  color: string;
  height?: number;
  className?: string;
}) {
  const width = 120;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + ((max - val) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");

  // Create gradient fill area
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `M${firstPoint} ${points.map((_, i) => points[i]).join(" L")} L${lastPoint.split(",")[0]},${height} L${firstPoint.split(",")[0]},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkGrad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#sparkGrad-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
    </svg>
  );
}

/* ─── Bar Chart (SVG) ─── */
export function BarChart({
  chartData,
  className,
}: {
  chartData?: ChartData;
  className?: string;
}) {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return <ChartSkeleton className={className} />;
  }

  const { data, color, title, subtitle, total } = chartData;
  const max = Math.max(...data.map((d) => d.value));
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-bold text-foreground truncate">
            {title}
          </h3>
          <p className="font-body text-[11px] text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>
        {total && (
          <span className="font-heading text-xl font-extrabold text-primary shrink-0">
            {total}
          </span>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative h-[140px] flex items-end gap-[6px]" role="img" aria-label={`${title} bar chart`}>
        {data.map((point, idx) => {
          const heightPct = (point.value / max) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={point.label}
              className="flex-1 flex flex-col items-center gap-1 relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-heading font-bold rounded-lg whitespace-nowrap z-10 shadow-md pointer-events-none">
                  {point.value.toLocaleString()}
                </div>
              )}

              {/* Bar */}
              <div className="w-full flex items-end h-[110px]">
                <div
                  className="w-full rounded-t-md transition-all duration-300 ease-[var(--ease-premium)] cursor-pointer"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isHovered ? color : `${color}80`,
                    minHeight: "4px",
                  }}
                />
              </div>

              {/* Label */}
              <span className="font-body text-[9px] font-semibold text-muted-foreground/70 leading-none">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Area Chart (SVG) ─── */
export function AreaChart({
  chartData,
  className,
}: {
  chartData?: ChartData;
  className?: string;
}) {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return <ChartSkeleton className={className} />;
  }

  const { data, color, title, subtitle, total } = chartData;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const svgWidth = 400;
  const svgHeight = 120;
  const padX = 10;
  const padY = 10;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (svgWidth - padX * 2);
    const y = padY + ((max - d.value) / range) * (svgHeight - padY * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${svgHeight} L${points[0].x},${svgHeight} Z`;

  const gradId = `areaGrad-${chartData.id}`;

  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-bold text-foreground truncate">
            {title}
          </h3>
          <p className="font-body text-[11px] text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>
        {total && (
          <span className="font-heading text-xl font-extrabold text-primary shrink-0">
            {total}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="relative" role="img" aria-label={`${title} area chart`}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-[140px]">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 3}
                fill={hoveredIdx === i ? color : "white"}
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute px-2.5 py-1.5 bg-foreground text-background text-[10px] font-heading font-bold rounded-lg shadow-md pointer-events-none z-10 whitespace-nowrap"
            style={{
              left: `${(points[hoveredIdx].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIdx].y / svgHeight) * 100 - 16}%`,
              transform: "translateX(-50%)",
            }}
          >
            {points[hoveredIdx].label}: {points[hoveredIdx].value.toLocaleString()}
          </div>
        )}

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-2">
          {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d) => (
            <span key={d.label} className="font-body text-[9px] font-semibold text-muted-foreground/60">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card with Sparkline (Enhanced KPI) ─── */
export function KpiCard({
  label,
  value,
  formattedValue,
  change,
  changeType,
  comparisonLabel,
  icon: Icon,
  sparklineData,
  sparklineColor,
  className,
  isLoading = false,
}: {
  label: string;
  value: number;
  formattedValue: string;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  comparisonLabel: string;
  icon: React.ElementType;
  sparklineData?: number[];
  sparklineColor?: string;
  className?: string;
  isLoading?: boolean;
}) {
  const animatedValue = useAnimatedCounter(value);
  const isUp = change >= 0;

  const changeColors = {
    positive: "text-emerald-600",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  };

  if (isLoading) {
    return <KpiSkeleton />;
  }

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all group relative overflow-hidden",
        className
      )}
    >
      {/* Ambient glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-all" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2 min-w-0 flex-1">
          <span className="font-body text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            {label}
          </span>
          <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-none block">
            {formattedValue}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-heading text-[11px] font-extrabold", changeColors[changeType])}>
            {isUp ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          <span className="font-body text-[10px] text-muted-foreground">
            {comparisonLabel}
          </span>
        </div>

        {sparklineData && (
          <Sparkline
            data={sparklineData}
            color={sparklineColor || "hsl(155, 43%, 21%)"}
            height={28}
            className="w-16 h-7 opacity-60 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
    </div>
  );
}

/* ─── KPI Skeleton ─── */
export function KpiSkeleton() {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-muted rounded-lg" />
          <div className="h-8 w-20 bg-muted rounded-lg" />
        </div>
        <div className="w-10 h-10 bg-muted rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-16 bg-muted rounded-lg" />
        <div className="h-3 w-20 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

/* ─── Chart Skeleton ─── */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-4 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-muted rounded-lg" />
          <div className="h-3 w-24 bg-muted rounded-lg" />
        </div>
        <div className="h-6 w-16 bg-muted rounded-lg" />
      </div>
      <div className="h-[140px] bg-muted/50 rounded-xl flex items-end gap-[6px] p-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-muted rounded-t-md"
            style={{ height: `${30 + ((i * 17) % 60)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Section Skeleton ─── */
export function SectionSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse", className)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-muted rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-muted rounded-lg" />
            <div className="h-3 w-20 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3 py-2">
            <div className="h-3 bg-muted rounded-lg" style={{ width: `${50 + ((i * 19) % 40)}%` }} />
            <div className="h-3 w-16 bg-muted rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
