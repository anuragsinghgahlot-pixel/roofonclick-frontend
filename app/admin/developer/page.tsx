"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Terminal,
  Key,
  Webhook,
  SlidersHorizontal,
  Activity,
  Zap,
  Globe,
  Database,
  Lock,
  Bot,
  RefreshCw,
  Plus,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Cpu,
  HardDrive,
  Clock,
  ShieldCheck,
  Code,
  X,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  SectionCard,
  KpiCard,
  DataTable,
} from "@/components/admin";
import type { ColumnDef, RowAction } from "@/components/admin/data-table";
import {
  AdminDeveloperService,
  ApiKeyItem,
  WebhookEndpoint,
  IntegrationServiceConfig,
  DeveloperQuickStats,
} from "@/services/admin-developer";

type DevModuleId =
  | "overview"
  | "apikeys"
  | "webhooks"
  | "integrations"
  | "env"
  | "monitoring"
  | "rateLimits";

const DEV_MODULES: { id: DevModuleId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview & Health", icon: Activity },
  { id: "apikeys", label: "API Keys", icon: Key },
  { id: "webhooks", label: "Webhook Center", icon: Webhook },
  { id: "integrations", label: "Third-Party Services", icon: Layers },
  { id: "env", label: "Environment Vars", icon: Lock },
  { id: "monitoring", label: "System Monitoring", icon: Cpu },
  { id: "rateLimits", label: "Rate Limits & Quotas", icon: ShieldCheck },
];

export default function AdminDeveloperPage() {
  /* ─── State ─── */
  const [activeModule, setActiveModule] = React.useState<DevModuleId>("overview");
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>(() => AdminDeveloperService.getApiKeys());
  const [webhooks, setWebhooks] = React.useState<WebhookEndpoint[]>(() => AdminDeveloperService.getWebhooks());
  const [integrations] = React.useState<IntegrationServiceConfig[]>(() => AdminDeveloperService.getIntegrations());

  const stats: DeveloperQuickStats = React.useMemo(
    () => AdminDeveloperService.getQuickStats(),
    []
  );

  /* Modal state */
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyEnv, setNewKeyEnv] = React.useState<ApiKeyItem["environment"]>("Production");

  /* Handlers */
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey: ApiKeyItem = {
      id: `KEY-${Date.now()}`,
      name: newKeyName.trim(),
      maskedKey: `sk_live_••••••••${Math.floor(1000 + Math.random() * 9000)}`,
      environment: newKeyEnv,
      permissions: "Full Access",
      createdDate: new Date().toISOString().substring(0, 10),
      lastUsed: "Never",
      status: "Active",
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setIsCreateKeyModalOpen(false);
    toast.success(`API Key "${newKey.name}" generated successfully! Secrets are masked.`);
  };

  const handleRotateKey = (key: ApiKeyItem) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === key.id ? { ...k, maskedKey: `sk_live_••••••••${Math.floor(1000 + Math.random() * 9000)}` } : k))
    );
    toast.info(`Rotated API Key ${key.id}. Previous secret invalidated.`);
  };

  const handleToggleKeyStatus = (key: ApiKeyItem) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === key.id ? { ...k, status: k.status === "Active" ? "Disabled" : "Active" } : k))
    );
    toast.warning(`Key ${key.id} status updated.`);
  };

  /* ─── API Keys Table Columns ─── */
  const apiKeyColumns: ColumnDef<ApiKeyItem>[] = [
    {
      id: "name",
      header: "Key Name",
      sortable: true,
      minWidth: "180px",
      accessor: (k) => k.name,
      cell: (val, row) => (
        <div>
          <span className="font-heading text-xs font-bold text-foreground block">{String(val)}</span>
          <span className="font-mono text-[10px] text-muted-foreground block">{row.id}</span>
        </div>
      ),
    },
    {
      id: "key",
      header: "Secret Key (Masked)",
      minWidth: "180px",
      accessor: (k) => k.maskedKey,
      cell: (val) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          {String(val)}
        </span>
      ),
    },
    {
      id: "env",
      header: "Environment",
      sortable: true,
      minWidth: "110px",
      accessor: (k) => k.environment,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-muted/60 text-foreground">
          {String(val)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      minWidth: "100px",
      accessor: (k) => k.status,
      cell: (val) => (
        <span className={`px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase ${val === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-destructive/10 text-destructive"}`}>
          {String(val)}
        </span>
      ),
    },
    { id: "lastUsed", header: "Last Used", sortable: true, minWidth: "120px", accessor: (k) => k.lastUsed },
  ];

  /* ─── Webhook Table Columns ─── */
  const webhookColumns: ColumnDef<WebhookEndpoint>[] = [
    { id: "id", header: "ID", sortable: true, minWidth: "90px", accessor: (w) => w.id },
    {
      id: "event",
      header: "Event Type",
      sortable: true,
      minWidth: "150px",
      accessor: (w) => w.eventType,
      cell: (val) => <span className="font-mono text-xs font-bold text-primary">{String(val)}</span>,
    },
    {
      id: "endpoint",
      header: "Endpoint URL",
      minWidth: "250px",
      accessor: (w) => w.endpointUrl,
      cell: (val) => <span className="font-mono text-[11px] text-foreground truncate block">{String(val)}</span>,
    },
    { id: "gateway", header: "Gateway", sortable: true, minWidth: "140px", accessor: (w) => w.gateway },
    {
      id: "status",
      header: "HTTP Status",
      sortable: true,
      minWidth: "110px",
      accessor: (w) => w.httpStatus,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          {Number(val)} OK
        </span>
      ),
    },
    { id: "lastDelivery", header: "Last Delivery", sortable: true, minWidth: "130px", accessor: (w) => w.lastDelivery },
  ];

  return (
    <AdminPageContainer maxWidth="1600px">
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Developer & Integration Center (Enterprise Edition)"
        subtitle="Technical control room for API keys, webhooks, third-party services, system latency & rate limits"
        actions={
          <button
            type="button"
            onClick={() => setIsCreateKeyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate API Key</span>
          </button>
        }
      />

      {/* ═══ Top Dashboard KPI Cards (7 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Health Score" value={stats.integrationHealth} formattedValue={`${stats.integrationHealth}%`} change={0} changeType="neutral" comparisonLabel="operational" icon={Activity} />
        <KpiCard label="Services" value={stats.connectedServices} formattedValue={`${stats.connectedServices} Active`} change={0} changeType="neutral" comparisonLabel="integrations" icon={Layers} />
        <KpiCard label="API Reqs Today" value={stats.apiRequestsToday} formattedValue={stats.apiRequestsToday.toLocaleString()} change={14} changeType="positive" comparisonLabel="requests" icon={Zap} />
        <KpiCard label="Webhooks" value={stats.webhookDeliveries} formattedValue={stats.webhookDeliveries.toLocaleString()} change={12} changeType="positive" comparisonLabel="deliveries" icon={Webhook} />
        <KpiCard label="API Latency" value={stats.systemLatencyMs} formattedValue={`${stats.systemLatencyMs}ms`} change={-5} changeType="positive" comparisonLabel="fast response" icon={Clock} />
        <KpiCard label="Error Rate" value={stats.errorRatePercent} formattedValue={`${stats.errorRatePercent}%`} change={0} changeType="neutral" comparisonLabel="low errors" icon={CheckCircle2} />
        <KpiCard label="Success Rate" value={stats.successRatePercent} formattedValue={`${stats.successRatePercent}%`} change={0} changeType="neutral" comparisonLabel="uptime" icon={ShieldCheck} />
      </div>

      {/* ═══ Two-Panel Layout (Left Navigation + Right Content) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Navigation (3 cols) */}
        <div className="lg:col-span-3 sticky top-20 bg-card border border-border/60 rounded-2xl p-2 space-y-1 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-border/40 text-[11px] font-heading font-extrabold uppercase text-muted-foreground tracking-wider">
            Developer Controls
          </div>
          <div className="space-y-0.5">
            {DEV_MODULES.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Module 1: Overview */}
          {activeModule === "overview" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-foreground">Integration Services Overview</h2>
                <p className="font-body text-xs text-muted-foreground">Status and quota utilization across connected third-party APIs</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {integrations.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-xl border border-border/60 bg-card space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-foreground">{srv.serviceName}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {srv.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-body">
                      <div>Provider: <strong className="font-heading text-foreground">{srv.provider}</strong></div>
                      <div>Quota Used: <strong className="font-heading text-primary">{srv.quotaUsed}</strong></div>
                      <div>Latency: <strong className="font-heading text-foreground">{srv.latencyMs}ms</strong></div>
                      <div>API Key: <code className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded">{srv.maskedApiKey}</code></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 2: API Keys */}
          {activeModule === "apikeys" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-foreground">API Key Management ({apiKeys.length})</h2>
                  <p className="font-body text-xs text-muted-foreground">Manage production API tokens. Secrets are strictly masked.</p>
                </div>
              </div>

              <DataTable<ApiKeyItem>
                columns={apiKeyColumns}
                data={apiKeys}
                getRowId={(k) => k.id}
                searchable={true}
                searchPlaceholder="Search key name or ID..."
                rowActions={[
                  { id: "rotate", label: "Rotate Secret Key", icon: RefreshCw, onClick: (k) => handleRotateKey(k) },
                  { id: "disable", label: "Toggle Status", icon: Lock, variant: "warning", onClick: (k) => handleToggleKeyStatus(k) },
                ]}
              />
            </div>
          )}

          {/* Module 3: Webhook Center */}
          {activeModule === "webhooks" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-foreground">Webhook Center</h2>
                <p className="font-body text-xs text-muted-foreground">Live webhook events delivery history & HTTP response statuses</p>
              </div>

              <DataTable<WebhookEndpoint>
                columns={webhookColumns}
                data={webhooks}
                getRowId={(w) => w.id}
                searchable={true}
                searchPlaceholder="Search event type or endpoint URL..."
              />
            </div>
          )}

          {/* Module 4: System Monitoring */}
          {activeModule === "monitoring" && (
            <SectionCard title="Live Infrastructure & System Monitoring" subtitle="Real-time CPU, memory, API latency & database metrics">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-body">
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">CPU Load</span>
                  <span className="font-heading text-xl font-extrabold text-emerald-600">12%</span>
                  <span className="font-body text-[10px] text-muted-foreground block">8 vCPUs active</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Memory Usage</span>
                  <span className="font-heading text-xl font-extrabold text-foreground">38%</span>
                  <span className="font-body text-[10px] text-muted-foreground block">12.1 GB / 32 GB</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">API Latency</span>
                  <span className="font-heading text-xl font-extrabold text-primary">35ms</span>
                  <span className="font-body text-[10px] text-muted-foreground block">p99 = 85ms</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Database Latency</span>
                  <span className="font-heading text-xl font-extrabold text-emerald-600">8ms</span>
                  <span className="font-body text-[10px] text-muted-foreground block">Primary PostgreSQL</span>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Other Modules Placeholder */}
          {["integrations", "env", "rateLimits"].includes(activeModule) && (
            <SectionCard title={`${activeModule.toUpperCase()} Control Module`} subtitle="Technical integration parameters ready for production binding">
              <p className="font-body text-xs text-muted-foreground">Service parameters configured and bound to production contracts.</p>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Generate API Key Modal */}
      <AnimatePresence>
        {isCreateKeyModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateKeyModalOpen(false)} className="fixed inset-0 z-[499] bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[500] w-full max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-heading text-base font-extrabold text-foreground">Generate New API Key</h3>
                <button type="button" onClick={() => setIsCreateKeyModalOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleGenerateKey} className="space-y-3">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Key Description / Name</label>
                  <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g. Backend Microservice Key" className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Target Environment</label>
                  <select value={newKeyEnv} onChange={(e) => setNewKeyEnv(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold">
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
                <button type="submit" disabled={!newKeyName.trim()} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all cursor-pointer">
                  Generate Secret Key
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
