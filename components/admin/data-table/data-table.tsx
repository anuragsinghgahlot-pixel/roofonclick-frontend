"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Download,
  FileSpreadsheet,
  FileText,
  Columns3,
  X,
  Check,
  AlertCircle,
  RotateCcw,
  Filter,
  CalendarDays,
  Inbox,
} from "lucide-react";
import type {
  DataTableProps,
  ColumnDef,
  SortConfig,
  SortDirection,
  FilterConfig,
  RowAction,
  BulkAction,
  ExportFormat,
  PAGE_SIZE_OPTIONS,
} from "./types";

/* ─── Constants ─── */
const PAGE_SIZES = [10, 25, 50, 100] as const;

/* ─── Main Data Table Component ─── */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  title,
  subtitle,
  searchable = true,
  searchPlaceholder = "Search...",
  selectable = false,
  rowActions,
  bulkActions,
  exportConfig,
  pagination,
  onPaginationChange,
  isLoading = false,
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon = Inbox,
  stickyHeader = true,
  columnToggle = true,
  toolbarActions,
  onSortChange,
  onFilterChange,
  onSearchChange,
  className,
  statusFilter,
  dateFilter = false,
  mobileCardRenderer,
}: DataTableProps<T>) {
  /* ─── State ─── */
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortConfig | null>(null);
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(() => {
    const visible = new Set<string>();
    columns.forEach((col) => {
      if (col.defaultVisible !== false) visible.add(col.id);
    });
    return visible;
  });
  const [showColumnMenu, setShowColumnMenu] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);
  const [openRowAction, setOpenRowAction] = React.useState<string | null>(null);
  const [pageSize, setPageSize] = React.useState(pagination?.pageSize || 10);
  const [currentPage, setCurrentPage] = React.useState(pagination?.currentPage || 1);

  const columnMenuRef = React.useRef<HTMLDivElement>(null);
  const exportMenuRef = React.useRef<HTMLDivElement>(null);
  const filterMenuRef = React.useRef<HTMLDivElement>(null);
  const rowActionRef = React.useRef<HTMLDivElement>(null);

  /* ─── Status filter state ─── */
  const [statusValue, setStatusValue] = React.useState<string>("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  /* ─── Click outside handlers ─── */
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) setShowColumnMenu(false);
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) setShowExportMenu(false);
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) setShowFilterMenu(false);
      if (rowActionRef.current && !rowActionRef.current.contains(e.target as Node)) setOpenRowAction(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─── Visible column list ─── */
  const activeColumns = columns.filter((col) => visibleColumns.has(col.id));

  /* ─── Filtering Logic (client-side) ─── */
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.accessor(row);
          return val != null && String(val).toLowerCase().includes(q);
        })
      );
    }

    // Status filter
    if (statusValue) {
      result = result.filter((row) => {
        return columns.some((col) => {
          if (col.type === "status") {
            return String(col.accessor(row)).toLowerCase() === statusValue.toLowerCase();
          }
          return false;
        });
      });
    }

    return result;
  }, [data, search, columns, statusValue]);

  /* ─── Sorting Logic (client-side) ─── */
  const sortedData = React.useMemo(() => {
    if (!sort || !sort.direction) return filteredData;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = col.accessor(a);
      const bVal = col.accessor(b);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [filteredData, sort, columns]);

  /* ─── Pagination Logic (client-side) ─── */
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedData = React.useMemo(() => {
    const start = (effectivePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, effectivePage, pageSize]);

  /* ─── Handlers ─── */
  const handleSort = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (!col?.sortable) return;

    let newSort: SortConfig | null;
    if (sort?.columnId === columnId) {
      if (sort.direction === "asc") {
        newSort = { columnId, direction: "desc" };
      } else if (sort.direction === "desc") {
        newSort = null;
      } else {
        newSort = { columnId, direction: "asc" };
      }
    } else {
      newSort = { columnId, direction: "asc" };
    }

    setSort(newSort);
    onSortChange?.(newSort);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    onSearchChange?.(value);
  };

  const handlePageChange = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    onPaginationChange?.(p, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    onPaginationChange?.(1, size);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(getRowId)));
    }
  };

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) {
        if (next.size > 1) next.delete(colId);
      } else {
        next.add(colId);
      }
      return next;
    });
  };

  const resetColumns = () => {
    const visible = new Set<string>();
    columns.forEach((col) => {
      if (col.defaultVisible !== false) visible.add(col.id);
    });
    setVisibleColumns(visible);
  };

  const selectedRowData = data.filter((row) => selectedRows.has(getRowId(row)));
  const isAllSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  /* ─── Render ─── */
  return (
    <div className={cn("space-y-4", className)}>
      {/* ═══ Toolbar ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Search + Filters */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {searchable && (
            <div className="relative flex items-center max-w-xs w-full">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search table"
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-border/60 bg-muted/30 text-sm font-body text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Status Filter */}
          {statusFilter && (
            <select
              value={statusValue}
              onChange={(e) => { setStatusValue(e.target.value); setCurrentPage(1); }}
              aria-label="Filter by status"
              className="px-3 py-2 rounded-xl border border-border/60 bg-muted/30 text-xs font-heading font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer max-w-[150px]"
            >
              <option value="">All Status</option>
              {statusFilter.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Date Filter */}
          {dateFilter && (
            <div className="hidden md:flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                aria-label="From date"
                className="px-2 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40 w-[120px]"
              />
              <span className="text-[10px] text-muted-foreground">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                aria-label="To date"
                className="px-2 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40 w-[120px]"
              />
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {toolbarActions}

          {/* Column Toggle */}
          {columnToggle && (
            <div ref={columnMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                aria-label="Toggle columns"
                aria-expanded={showColumnMenu}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground text-xs font-heading font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Columns3 className="w-4 h-4" />
                <span className="hidden sm:inline">Columns</span>
              </button>

              <AnimatePresence>
                {showColumnMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-[calc(100%+6px)] w-56 bg-card border border-border/60 rounded-2xl shadow-lg py-2 z-50"
                  >
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-border/40 mb-1">
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Toggle Columns
                      </span>
                      <button
                        type="button"
                        onClick={resetColumns}
                        className="font-heading text-[10px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => toggleColumn(col.id)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-body font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer outline-none focus-visible:bg-muted/30"
                      >
                        <span
                          className={cn(
                            "w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                            visibleColumns.has(col.id)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border bg-muted/30"
                          )}
                        >
                          {visibleColumns.has(col.id) && <Check className="w-3 h-3" />}
                        </span>
                        <span className="truncate">{col.header}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Export Menu */}
          {exportConfig && (
            <div ref={exportMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                aria-label="Export data"
                aria-expanded={showExportMenu}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground text-xs font-heading font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-[calc(100%+6px)] w-44 bg-card border border-border/60 rounded-2xl shadow-lg py-1.5 z-50"
                  >
                    {exportConfig.formats.includes("csv") && (
                      <button
                        type="button"
                        onClick={() => { exportConfig.onExport("csv", sortedData); setShowExportMenu(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-heading font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Export CSV
                      </button>
                    )}
                    {exportConfig.formats.includes("excel") && (
                      <button
                        type="button"
                        onClick={() => { exportConfig.onExport("excel", sortedData); setShowExportMenu(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-heading font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                        Export Excel
                      </button>
                    )}
                    {exportConfig.formats.includes("pdf") && (
                      <button
                        type="button"
                        onClick={() => { exportConfig.onExport("pdf", sortedData); setShowExportMenu(false); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-heading font-semibold text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-destructive" />
                        Export PDF
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Active Filters Bar ═══ */}
      {(search || statusValue) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Active Filters:
          </span>
          {search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-heading font-bold">
              Search: &quot;{search}&quot;
              <button type="button" onClick={() => handleSearch("")} className="hover:text-accent cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          {statusValue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-heading font-bold">
              Status: {statusValue}
              <button type="button" onClick={() => setStatusValue("")} className="hover:text-accent cursor-pointer"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            type="button"
            onClick={() => { setSearch(""); setStatusValue(""); setDateFrom(""); setDateTo(""); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-heading font-bold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* ═══ Table (Desktop) ═══ */}
      <div className="hidden md:block bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            {/* Header */}
            <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
              <tr className="bg-muted/40 border-b border-border/40">
                {selectable && (
                  <th className="w-12 px-4 py-3.5" scope="col">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      aria-label={isAllSelected ? "Deselect all" : "Select all"}
                      className={cn(
                        "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        isAllSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : isSomeSelected
                          ? "bg-primary/50 border-primary text-primary-foreground"
                          : "border-border/80 bg-card hover:border-primary/40"
                      )}
                    >
                      {(isAllSelected || isSomeSelected) && <Check className="w-3 h-3" />}
                    </button>
                  </th>
                )}
                {activeColumns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      "px-4 py-3.5 font-heading text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground select-none",
                      col.sortable && "cursor-pointer hover:text-foreground transition-colors",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.sticky && "sticky left-0 z-20 bg-muted/40"
                    )}
                    style={{ minWidth: col.minWidth }}
                    onClick={() => col.sortable && handleSort(col.id)}
                    aria-sort={sort?.columnId === col.id ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.headerCell ? col.headerCell() : col.header}
                      {col.sortable && (
                        <span className="shrink-0">
                          {sort?.columnId === col.id ? (
                            sort.direction === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <th className="w-14 px-4 py-3.5 text-right" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-border/20 animate-pulse">
                    {selectable && <td className="px-4 py-3.5"><div className="w-4 h-4 bg-muted rounded-md" /></td>}
                    {activeColumns.map((col, colIdx) => (
                      <td key={col.id} className="px-4 py-3.5">
                        <div className="h-4 bg-muted rounded-lg" style={{ width: `${40 + ((i * 13 + colIdx * 17) % 50)}%` }} />
                      </td>
                    ))}
                    {rowActions && <td className="px-4 py-3.5"><div className="w-6 h-4 bg-muted rounded-lg ml-auto" /></td>}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={(selectable ? 1 : 0) + activeColumns.length + (rowActions ? 1 : 0)}
                    className="text-center py-16"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                        <EmptyIcon className="w-7 h-7" />
                      </div>
                      <p className="font-body text-sm text-muted-foreground">{emptyMessage}</p>
                      {search && (
                        <button
                          type="button"
                          onClick={() => handleSearch("")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-heading font-bold hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        "border-b border-border/20 transition-colors",
                        isSelected
                          ? "bg-primary/[0.04]"
                          : "hover:bg-muted/20"
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleRowSelection(rowId)}
                            aria-label={isSelected ? `Deselect row ${rowId}` : `Select row ${rowId}`}
                            className={cn(
                              "w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border/80 bg-card hover:border-primary/40"
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        </td>
                      )}
                      {activeColumns.map((col) => {
                        const value = col.accessor(row);
                        return (
                          <td
                            key={col.id}
                            className={cn(
                              "px-4 py-3 font-body text-xs text-foreground/90",
                              col.align === "center" && "text-center",
                              col.align === "right" && "text-right",
                              col.sticky && "sticky left-0 z-10 bg-card"
                            )}
                          >
                            {col.cell ? col.cell(value, row) : (
                              <span className="line-clamp-1">{value != null ? String(value) : "—"}</span>
                            )}
                          </td>
                        );
                      })}
                      {rowActions && rowActions.length > 0 && (
                        <td className="px-4 py-3 text-right">
                          <RowActionMenu
                            rowId={rowId}
                            row={row}
                            actions={rowActions}
                            isOpen={openRowAction === rowId}
                            onToggle={() => setOpenRowAction(openRowAction === rowId ? null : rowId)}
                            onClose={() => setOpenRowAction(null)}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ Mobile Card View ═══ */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`m-skeleton-${i}`} className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 animate-pulse">
              <div className="h-4 w-3/4 bg-muted rounded-lg" />
              <div className="h-3 w-1/2 bg-muted rounded-lg" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3 bg-muted rounded-lg" />
                <div className="h-3 bg-muted rounded-lg" />
              </div>
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
              <EmptyIcon className="w-7 h-7" />
            </div>
            <p className="font-body text-sm text-muted-foreground text-center">{emptyMessage}</p>
          </div>
        ) : (
          paginatedData.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows.has(rowId);

            if (mobileCardRenderer) {
              return <React.Fragment key={rowId}>{mobileCardRenderer(row, rowActions)}</React.Fragment>;
            }

            return (
              <div
                key={rowId}
                className={cn(
                  "bg-card border rounded-2xl p-4 space-y-3 transition-colors",
                  isSelected ? "border-primary/40 bg-primary/[0.03]" : "border-border/60"
                )}
              >
                {/* Selection + Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {selectable && (
                      <button
                        type="button"
                        onClick={() => toggleRowSelection(rowId)}
                        aria-label={isSelected ? "Deselect" : "Select"}
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border/80 bg-muted/30"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    )}
                    <div className="min-w-0">
                      {activeColumns.slice(0, 2).map((col) => {
                        const value = col.accessor(row);
                        return (
                          <div key={col.id} className="truncate">
                            {col.cell ? col.cell(value, row) : (
                              <span className={cn(
                                "font-body text-xs",
                                col === activeColumns[0] ? "font-heading text-sm font-bold text-foreground" : "text-muted-foreground"
                              )}>
                                {value != null ? String(value) : "—"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {rowActions && (
                    <RowActionMenu
                      rowId={rowId}
                      row={row}
                      actions={rowActions}
                      isOpen={openRowAction === rowId}
                      onToggle={() => setOpenRowAction(openRowAction === rowId ? null : rowId)}
                      onClose={() => setOpenRowAction(null)}
                    />
                  )}
                </div>

                {/* Additional fields */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {activeColumns.slice(2).map((col) => {
                    const value = col.accessor(row);
                    return (
                      <div key={col.id} className="space-y-0.5">
                        <span className="font-body text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {col.header}
                        </span>
                        <div className="font-body text-[11px] text-foreground">
                          {col.cell ? col.cell(value, row) : (
                            <span>{value != null ? String(value) : "—"}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══ Pagination ═══ */}
      {!isLoading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {/* Info */}
          <div className="flex items-center gap-3 text-xs font-body text-muted-foreground">
            <span>
              Showing {(effectivePage - 1) * pageSize + 1}–{Math.min(effectivePage * pageSize, totalItems)} of {totalItems}
            </span>
            <span className="hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                aria-label="Rows per page"
                className="px-2 py-1 rounded-lg border border-border/60 bg-muted/30 text-xs font-heading font-bold text-foreground outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={effectivePage === 1}
              aria-label="First page"
              className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(effectivePage - 1)}
              disabled={effectivePage === 1}
              aria-label="Previous page"
              className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages: number[] = [];
              const maxVisible = 5;
              let start = Math.max(1, effectivePage - Math.floor(maxVisible / 2));
              const end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
              for (let i = start; i <= end; i++) pages.push(i);

              return pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  aria-current={p === effectivePage ? "page" : undefined}
                  className={cn(
                    "min-w-[36px] h-9 px-2 rounded-lg font-heading text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    p === effectivePage
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-border/60"
                  )}
                >
                  {p}
                </button>
              ));
            })()}

            <button
              type="button"
              onClick={() => handlePageChange(effectivePage + 1)}
              disabled={effectivePage === totalPages}
              aria-label="Next page"
              className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={effectivePage === totalPages}
              aria-label="Last page"
              className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ Bulk Action Toolbar (Floating) ═══ */}
      <AnimatePresence>
        {selectable && selectedRows.size > 0 && bulkActions && bulkActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4"
            role="toolbar"
            aria-label="Bulk actions"
          >
            <span className="font-heading text-xs font-bold whitespace-nowrap">
              {selectedRows.size} selected
            </span>
            <div className="w-px h-5 bg-background/20" />
            <div className="flex items-center gap-1.5 flex-wrap">
              {bulkActions.map((action) => {
                const variantClasses = {
                  default: "hover:bg-background/10",
                  destructive: "hover:bg-destructive/20 text-destructive-foreground",
                  success: "hover:bg-emerald-500/20",
                  warning: "hover:bg-amber-500/20",
                };

                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      action.onClick(selectedRowData);
                      setSelectedRows(new Set());
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-heading font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                      variantClasses[action.variant || "default"]
                    )}
                  >
                    {action.icon && <action.icon className="w-3.5 h-3.5" />}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="w-px h-5 bg-background/20" />
            <button
              type="button"
              onClick={() => setSelectedRows(new Set())}
              aria-label="Clear selection"
              className="p-1.5 rounded-lg hover:bg-background/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Row Action Dropdown ─── */
function RowActionMenu<T>({
  rowId,
  row,
  actions,
  isOpen,
  onToggle,
  onClose,
}: {
  rowId: string;
  row: T;
  actions: RowAction<T>[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, onClose]);

  const visibleActions = actions.filter((a) => !a.visible || a.visible(row));

  if (visibleActions.length === 0) return null;

  return (
    <div ref={menuRef} className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="Row actions"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            role="menu"
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute right-0 top-[calc(100%+4px)] w-44 bg-card border border-border/60 rounded-2xl shadow-xl py-1.5 z-[100] backdrop-blur-md"
          >
            {visibleActions.map((action, idx) => {
              const variantClasses = {
                default: "text-foreground hover:bg-muted/40",
                destructive: "text-destructive hover:bg-destructive/10",
                success: "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
                warning: "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10",
              };

              return (
                <React.Fragment key={action.id}>
                  {action.separator && idx > 0 && (
                    <div className="my-1 h-px bg-border/40" />
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                      action.onClick(row);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-4 py-2 text-xs font-heading font-semibold transition-colors cursor-pointer outline-none focus-visible:bg-muted/30 text-left select-none",
                      variantClasses[action.variant || "default"]
                    )}
                  >
                    {action.icon && <action.icon className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{action.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
