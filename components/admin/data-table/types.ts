/* ─── Admin Data Table — Generic Types ─── */
/* Backend-ready interfaces. No hardcoded fields. */

import type { LucideIcon } from "lucide-react";

/* ─── Column Definition ─── */
export interface ColumnDef<T> {
  /** Unique key matching a field in T */
  id: string;
  /** Display header label */
  header: string;
  /** Accessor function to get the cell value */
  accessor: (row: T) => unknown;
  /** Custom cell renderer */
  cell?: (value: unknown, row: T) => React.ReactNode;
  /** Is this column sortable? */
  sortable?: boolean;
  /** Is this column filterable? */
  filterable?: boolean;
  /** Filter options for dropdown filters */
  filterOptions?: { label: string; value: string }[];
  /** Column type for special rendering */
  type?: "text" | "number" | "date" | "status" | "currency" | "boolean" | "custom";
  /** Column min-width */
  minWidth?: string;
  /** Is this column visible by default? */
  defaultVisible?: boolean;
  /** Is this column sticky (first column)? */
  sticky?: boolean;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Custom header renderer */
  headerCell?: () => React.ReactNode;
}

/* ─── Sort Config ─── */
export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  columnId: string;
  direction: SortDirection;
}

/* ─── Filter Config ─── */
export interface FilterConfig {
  columnId: string;
  value: string | string[];
  type: "text" | "select" | "multi-select" | "date" | "date-range";
}

export interface DateRangeFilter {
  from: string;
  to: string;
}

/* ─── Pagination Config ─── */
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/* ─── Row Action ─── */
export interface RowAction<T> {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: (row: T) => void;
  /** Condition for showing this action */
  visible?: (row: T) => boolean;
  /** Visual variant */
  variant?: "default" | "destructive" | "success" | "warning";
  /** Separator before this action */
  separator?: boolean;
}

/* ─── Bulk Action ─── */
export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: (selectedRows: T[]) => void;
  variant?: "default" | "destructive" | "success" | "warning";
  /** Require confirmation? */
  confirmMessage?: string;
}

/* ─── Export Format ─── */
export type ExportFormat = "csv" | "excel" | "pdf";

export interface ExportConfig {
  formats: ExportFormat[];
  onExport: (format: ExportFormat, data: unknown[]) => void;
  fileName?: string;
}

/* ─── Status Badge ─── */
export type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "blocked"
  | "draft"
  | "expired"
  | "verified"
  | "suspended"
  | "processing";

export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}

/* ─── Data Table Props ─── */
export interface DataTableProps<T> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Data rows */
  data: T[];
  /** Unique key accessor for each row */
  getRowId: (row: T) => string;
  /** Table title (optional) */
  title?: string;
  /** Table subtitle (optional) */
  subtitle?: string;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Row actions dropdown */
  rowActions?: RowAction<T>[];
  /** Bulk actions (shown when rows selected) */
  bulkActions?: BulkAction<T>[];
  /** Export configuration */
  exportConfig?: ExportConfig;
  /** Pagination config - if undefined, show all rows */
  pagination?: PaginationConfig;
  /** On pagination change */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state icon */
  emptyIcon?: LucideIcon;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Enable column visibility toggle */
  columnToggle?: boolean;
  /** Custom toolbar actions */
  toolbarActions?: React.ReactNode;
  /** On sort change */
  onSortChange?: (sort: SortConfig | null) => void;
  /** On filter change */
  onFilterChange?: (filters: FilterConfig[]) => void;
  /** On search change */
  onSearchChange?: (search: string) => void;
  /** Custom class */
  className?: string;
  /** Status filter options */
  statusFilter?: { label: string; value: string }[];
  /** Date filter */
  dateFilter?: boolean;
  /** Mobile card renderer (overrides default card) */
  mobileCardRenderer?: (row: T, actions?: RowAction<T>[]) => React.ReactNode;
}
