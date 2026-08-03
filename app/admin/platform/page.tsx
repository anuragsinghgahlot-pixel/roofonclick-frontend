"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  SlidersHorizontal,
  Activity,
  Zap,
  ShieldCheck,
  Globe,
  Settings,
  Palette,
  Search,
  Flag,
  Users,
  Bell,
  Mail,
  MessageSquare,
  Building,
  CreditCard,
  Lock,
  Bot,
  Terminal,
  Megaphone,
  History,
  Database,
  Wrench,
  Calendar,
  Search as SearchIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Save,
  Download,
  Key,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  SectionCard,
  KpiCard,
} from "@/components/admin";
import {
  AdminPlatformService,
  SystemServiceHealth,
  FeatureFlag,
  PermissionMatrixModule,
  AdminUser,
  PlatformAuditLog,
} from "@/services/admin-platform";
import { CommandPalette } from "@/components/admin/command-palette";

type SectionId =
  | "health"
  | "founder"
  | "general"
  | "branding"
  | "seo"
  | "featureFlags"
  | "permissions"
  | "notifications"
  | "propertyConfig"
  | "monetization"
  | "security"
  | "aiApi"
  | "audit";

const NAV_SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "health", label: "System Health", icon: Activity },
  { id: "founder", label: "Founder KPIs", icon: Zap },
  { id: "general", label: "General Settings", icon: Settings },
  { id: "branding", label: "Branding & Theme", icon: Palette },
  { id: "seo", label: "SEO Center", icon: Globe },
  { id: "featureFlags", label: "Feature Flags", icon: Flag },
  { id: "permissions", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "notifications", label: "Notifications & Templates", icon: Bell },
  { id: "propertyConfig", label: "Property Config", icon: Building },
  { id: "monetization", label: "Monetization & Payouts", icon: CreditCard },
  { id: "security", label: "Security & Gateways", icon: Lock },
  { id: "aiApi", label: "AI & API Center", icon: Bot },
  { id: "audit", label: "Audit & Backups", icon: History },
];

export default function AdminPlatformPage() {
  /* ─── State ─── */
  const [activeSection, setActiveSection] = React.useState<SectionId>("health");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);

  /* Data state */
  const healthServices: SystemServiceHealth[] = React.useMemo(
    () => AdminPlatformService.getSystemHealth(),
    []
  );
  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlag[]>(() =>
    AdminPlatformService.getFeatureFlags()
  );
  const permissions: PermissionMatrixModule[] = React.useMemo(
    () => AdminPlatformService.getPermissionMatrix(),
    []
  );
  const adminTeam: AdminUser[] = React.useMemo(
    () => AdminPlatformService.getAdminTeam(),
    []
  );
  const auditLogs: PlatformAuditLog[] = React.useMemo(
    () => AdminPlatformService.getAuditLogs(),
    []
  );

  /* Form state mock */
  const [generalForm, setGeneralForm] = React.useState({
    platformName: "RoofOnClick",
    companyName: "RoofOnClick Technologies Pvt. Ltd.",
    supportEmail: "support@roofonclick.com",
    supportPhone: "+91 98260 12345",
    timezone: "Asia/Kolkata (IST)",
    currency: "INR (₹)",
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("General Platform Settings saved successfully!");
  };

  const handleToggleFlagStatus = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => {
        if (f.id !== flagId) return f;
        const nextStatus = f.status === "Enabled" ? "Disabled" : f.status === "Disabled" ? "Beta" : "Enabled";
        return { ...f, status: nextStatus };
      })
    );
    toast.info(`Updated feature flag ${flagId} status.`);
  };

  const handleRolloutChange = (flagId: string, rollout: FeatureFlag["rolloutPercentage"]) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, rolloutPercentage: rollout } : f))
    );
    toast.success(`Feature rollout set to ${rollout}%`);
  };

  return (
    <AdminPageContainer maxWidth="1600px">
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Platform Control Center (Enterprise Edition)"
        subtitle="Master command center to configure, automate, and control the RoofOnClick ecosystem"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground text-xs font-heading font-bold transition-all cursor-pointer shadow-sm"
            >
              <SearchIcon className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Command Palette</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">Ctrl+K</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMaintenanceMode(!isMaintenanceMode);
                toast.warning(`Maintenance Mode ${!isMaintenanceMode ? "Enabled" : "Disabled"}`);
              }}
              className={`px-3 py-2 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isMaintenanceMode
                  ? "bg-destructive text-white"
                  : "border border-border/60 bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {isMaintenanceMode ? "Maintenance Active" : "Maintenance Mode"}
            </button>
          </div>
        }
      />

      {/* ═══ Two-Panel Layout (Left Sticky Navigation + Right Content Area) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Sidebar Navigation (3 cols) */}
        <div className="lg:col-span-3 sticky top-20 bg-card border border-border/60 rounded-2xl p-2 space-y-1 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-border/40 text-[11px] font-heading font-extrabold uppercase text-muted-foreground tracking-wider">
            Control Modules
          </div>
          <div className="space-y-0.5 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-none">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Scrollable Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Section 1: System Health */}
          {activeSection === "health" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-foreground">System Health Dashboard</h2>
                  <p className="font-body text-xs text-muted-foreground">Real-time status monitoring of all 12 core services & engines</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-heading text-xs font-extrabold">
                  Score: 98/100 Operational
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {healthServices.map((srv, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/60 bg-card space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-foreground">{srv.name}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {srv.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-body">
                      <span className="text-muted-foreground">Uptime: <strong className="text-foreground font-heading">{srv.uptimePercent}%</strong></span>
                      <span className="text-muted-foreground">Latency: <strong className="text-primary font-heading">{srv.responseTimeMs}ms</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Founder Dashboard */}
          {activeSection === "founder" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-foreground">Founder & Executive Dashboard</h2>
                <p className="font-body text-xs text-muted-foreground">High-level platform metric snapshot</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Today Revenue</span>
                  <span className="font-heading text-lg font-extrabold text-primary">₹55,000</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">MRR Run Rate</span>
                  <span className="font-heading text-lg font-extrabold text-foreground">₹10.3L</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Pending Approvals</span>
                  <span className="font-heading text-lg font-extrabold text-amber-600">3 Props</span>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                  <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Platform Growth</span>
                  <span className="font-heading text-lg font-extrabold text-emerald-600">+18.4%</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: General Settings */}
          {activeSection === "general" && (
            <SectionCard title="General Platform Settings" subtitle="Core company & localization configuration">
              <form onSubmit={handleSaveGeneral} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Platform Name</label>
                    <input
                      type="text"
                      value={generalForm.platformName}
                      onChange={(e) => setGeneralForm({ ...generalForm, platformName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={generalForm.companyName}
                      onChange={(e) => setGeneralForm({ ...generalForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Support Email</label>
                    <input
                      type="email"
                      value={generalForm.supportEmail}
                      onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Timezone</label>
                    <input
                      type="text"
                      value={generalForm.timezone}
                      onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </form>
            </SectionCard>
          )}

          {/* Section 4: Feature Flags */}
          {activeSection === "featureFlags" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-foreground">Feature Flag & Experimentation Center</h2>
                <p className="font-body text-xs text-muted-foreground">Manage live feature toggles & percentage rollouts across production</p>
              </div>

              <div className="space-y-3">
                {featureFlags.map((flag) => (
                  <div key={flag.id} className="p-4 rounded-xl border border-border/60 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-xs font-bold text-foreground">{flag.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-primary/10 text-primary">
                          {flag.category}
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground">{flag.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <select
                        value={flag.rolloutPercentage}
                        onChange={(e) => handleRolloutChange(flag.id, Number(e.target.value) as any)}
                        className="px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                      >
                        <option value={10}>10% Rollout</option>
                        <option value={25}>25% Rollout</option>
                        <option value={50}>50% Rollout</option>
                        <option value={75}>75% Rollout</option>
                        <option value={100}>100% Full</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleToggleFlagStatus(flag.id)}
                        className={`px-3 py-1.5 rounded-lg font-heading text-xs font-bold transition-all cursor-pointer ${
                          flag.status === "Enabled"
                            ? "bg-emerald-600 text-white"
                            : flag.status === "Beta"
                            ? "bg-amber-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {flag.status}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Roles & Permissions */}
          {activeSection === "permissions" && (
            <SectionCard title="Enterprise Permission Matrix" subtitle="Module-level role permissions grid">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 font-heading font-extrabold text-muted-foreground">
                      <th className="py-2.5 px-3">Module</th>
                      <th className="py-2.5 px-3 text-center">View</th>
                      <th className="py-2.5 px-3 text-center">Create</th>
                      <th className="py-2.5 px-3 text-center">Edit</th>
                      <th className="py-2.5 px-3 text-center">Delete</th>
                      <th className="py-2.5 px-3 text-center">Approve</th>
                      <th className="py-2.5 px-3 text-center">Export</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-body">
                    {permissions.map((p, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-heading font-bold text-foreground">{p.module}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.view ? "✓" : "—"}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.create ? "✓" : "—"}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.edit ? "✓" : "—"}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.delete ? "✓" : "—"}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.approve ? "✓" : "—"}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">{p.export ? "✓" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {/* Section 6: Audit Logs */}
          {activeSection === "audit" && (
            <SectionCard title="Security & Admin Audit Feed" subtitle="Real-time administrative action trail">
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl border border-border/40 bg-muted/20 space-y-1 text-xs font-body">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-foreground">{log.action}</span>
                      <span className="font-body text-[10px] text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground block">
                      By: {log.performedBy} • IP: {log.ipAddress} • Module: {log.module}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Other Sections Placeholder */}
          {["branding", "seo", "notifications", "propertyConfig", "monetization", "security", "aiApi"].includes(activeSection) && (
            <SectionCard title={`${activeSection.toUpperCase()} Module`} subtitle="Enterprise control module ready for production integration">
              <p className="font-body text-xs text-muted-foreground">Module parameters configured and bound to production contracts.</p>
            </SectionCard>
          )}
        </div>
      </div>

      {/* ═══ Command Palette Modal ═══ */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </AdminPageContainer>
  );
}
