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

/* ─── Mini Sparkline (Recharts) ─── */
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
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div className={cn("w-16", className)} style={{ height }} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell,
} from "recharts";

/* ─── Custom Recharts Tooltip ─── */
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-xl z-50">
        <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
        <p className="text-sm font-extrabold text-foreground font-heading">
          {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

/* ─── Bar Chart (Recharts) ─── */
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

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all shadow-sm",
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
      <div className="h-[150px] w-full pt-1" role="img" aria-label={`${title} bar chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border) / 0.5)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 500 }}
              allowDecimals={false}
            />
            <RechartsTooltip
              content={<CustomChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.06)", radius: 8 }}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
              fill={color || "hsl(var(--primary))"}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={color || "hsl(var(--primary))"}
                  fillOpacity={0.88}
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Area Chart (Recharts) ─── */
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
  const gradId = `areaGrad-${chartData.id || "default"}`;
  const strokeColor = color || "hsl(var(--primary))";

  return (
    <div
      className={cn(
        "bg-card border border-border/60 rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all shadow-sm",
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
      <div className="h-[150px] w-full pt-1" role="img" aria-label={`${title} area chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.45} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border) / 0.5)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 500 }}
              allowDecimals={false}
            />
            <RechartsTooltip
              content={<CustomChartTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradId})`}
              dot={{ r: 4, fill: strokeColor, strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 6, fill: strokeColor, stroke: "#fff", strokeWidth: 2 }}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
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
        "bg-card border border-border/60 rounded-xl p-3 flex flex-col gap-2 hover:border-primary/30 hover:shadow-md transition-all group relative overflow-hidden",
        className
      )}
    >
      {/* Ambient glow */}
      <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-all" />

      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-1 relative z-10">
        <span className="font-body text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-tight truncate flex-1 pr-1">
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Value */}
      <span className="font-heading text-lg sm:text-xl font-extrabold text-foreground tracking-tight leading-none relative z-10 truncate">
        {formattedValue}
      </span>

      {/* Change indicator */}
      <div className="flex items-center gap-1 relative z-10 flex-wrap">
        <span className={cn("font-heading text-[10px] font-extrabold whitespace-nowrap", changeColors[changeType])}>
          {isUp ? "↑" : "↓"} {Math.abs(change)}%
        </span>
        <span className="font-body text-[9px] text-muted-foreground truncate">
          {comparisonLabel}
        </span>
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
