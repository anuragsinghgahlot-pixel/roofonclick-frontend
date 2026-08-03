"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Megaphone,
  Ticket,
  Users,
  Gift,
  Sparkles,
  Layout,
  Send,
  Target,
  Split,
  Bot,
  TrendingUp,
  IndianRupee,
  Percent,
  Plus,
  Save,
  Pause,
  Play,
  Trash2,
  Calendar,
  CheckCircle2,
  Bell,
  MessageSquare,
  Award,
  Layers,
  Search as SearchIcon,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  SectionCard,
  KpiCard,
} from "@/components/admin";
import {
  AdminGrowthService,
  MarketingCampaign,
  CouponItem,
  LoyaltyTier,
  UserSegment,
  GrowthQuickStats,
} from "@/services/admin-growth";

type ModuleId =
  | "campaigns"
  | "coupons"
  | "referral"
  | "homepage"
  | "broadcast"
  | "segments"
  | "aiMarketing";

const MODULES: { id: ModuleId; label: string; icon: React.ElementType }[] = [
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "coupons", label: "Coupon Center", icon: Ticket },
  { id: "referral", label: "Referral & Loyalty", icon: Gift },
  { id: "homepage", label: "Homepage & Banners", icon: Layout },
  { id: "broadcast", label: "Multi-Channel Broadcast", icon: Send },
  { id: "segments", label: "Segments & A/B Test", icon: Target },
  { id: "aiMarketing", label: "AI Marketing Engine", icon: Bot },
];

export default function AdminGrowthPage() {
  /* ─── State ─── */
  const [activeModule, setActiveModule] = React.useState<ModuleId>("campaigns");
  const [campaigns, setCampaigns] = React.useState<MarketingCampaign[]>(() =>
    AdminGrowthService.getCampaigns()
  );
  const [coupons, setCoupons] = React.useState<CouponItem[]>(() =>
    AdminGrowthService.getCoupons()
  );
  const loyaltyTiers: LoyaltyTier[] = React.useMemo(
    () => AdminGrowthService.getLoyaltyTiers(),
    []
  );
  const segments: UserSegment[] = React.useMemo(
    () => AdminGrowthService.getSegments(),
    []
  );
  const stats: GrowthQuickStats = React.useMemo(
    () => AdminGrowthService.getQuickStats(),
    []
  );

  /* New Coupon Form State */
  const [couponCode, setCouponCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"Flat" | "Percentage">("Flat");
  const [discountValue, setDiscountValue] = React.useState(500);

  /* Broadcast Form State */
  const [broadcastTarget, setBroadcastTarget] = React.useState("Buyers / Students");
  const [broadcastChannel, setBroadcastChannel] = React.useState("WhatsApp");
  const [broadcastMessage, setBroadcastMessage] = React.useState("");

  /* Handlers */
  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === "Running" ? "Paused" : "Running";
        return { ...c, status: nextStatus };
      })
    );
    toast.info(`Updated campaign status.`);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("Campaign archived.");
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newC: CouponItem = {
      id: `COUP-${Date.now()}`,
      code: couponCode.trim().toUpperCase(),
      discountType,
      discountValue,
      minBookingValue: 5000,
      usageLimit: 500,
      usedCount: 0,
      applicableCities: ["Indore"],
      validUntil: "2026-12-31",
      status: "Active",
    };
    setCoupons((prev) => [newC, ...prev]);
    setCouponCode("");
    toast.success(`Coupon ${newC.code} generated successfully!`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    toast.success(`Broadcast queued via ${broadcastChannel} to target: ${broadcastTarget}`);
    setBroadcastMessage("");
  };

  return (
    <AdminPageContainer maxWidth="1600px">
      {/* ═══ Header ═══ */}
      <PageHeader
        title="Growth & Marketing Center (Enterprise Edition)"
        subtitle="Complete growth engine: campaigns, coupons, loyalty tiers, broadcasts & AI recommendations"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModule("campaigns")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        }
      />

      {/* ═══ Executive Dashboard (8 Cards Grid) ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard
          label="Running"
          value={stats.campaignsRunning}
          formattedValue={String(stats.campaignsRunning)}
          change={12.0}
          changeType="positive"
          comparisonLabel="active campaigns"
          icon={Megaphone}
        />
        <KpiCard
          label="Active Coupons"
          value={stats.activeCoupons}
          formattedValue={String(stats.activeCoupons)}
          change={0}
          changeType="neutral"
          comparisonLabel="promo codes"
          icon={Ticket}
        />
        <KpiCard
          label="Referral Users"
          value={stats.referralUsers}
          formattedValue={stats.referralUsers.toLocaleString()}
          change={22.4}
          changeType="positive"
          comparisonLabel="viral invites"
          icon={Gift}
        />
        <KpiCard
          label="Conversion"
          value={stats.conversionRate}
          formattedValue={`${stats.conversionRate}%`}
          change={1.2}
          changeType="positive"
          comparisonLabel="visitor → move-in"
          icon={Percent}
        />
        <KpiCard
          label="Avg CTR"
          value={stats.ctr}
          formattedValue={`${stats.ctr}%`}
          change={2.5}
          changeType="positive"
          comparisonLabel="click-through rate"
          icon={Sparkles}
        />
        <KpiCard
          label="Campaign Rev"
          value={stats.revenueGenerated}
          formattedValue={`₹${(stats.revenueGenerated / 100000).toFixed(1)}L`}
          change={28.5}
          changeType="positive"
          comparisonLabel="attributed revenue"
          icon={IndianRupee}
        />
        <KpiCard
          label="Campaign ROI"
          value={stats.campaignRoi}
          formattedValue={`${stats.campaignRoi}%`}
          change={45.0}
          changeType="positive"
          comparisonLabel="return on spend"
          icon={TrendingUp}
        />
        <KpiCard
          label="Budget Spent"
          value={stats.budgetSpent}
          formattedValue={`₹${(stats.budgetSpent / 1000).toFixed(0)}k`}
          change={0}
          changeType="neutral"
          comparisonLabel="total spend"
          icon={Calendar}
        />
      </div>

      {/* ═══ Two-Panel Layout (Left Sticky Navigation + Right Content Area) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Sidebar Navigation (3 cols) */}
        <div className="lg:col-span-3 sticky top-20 bg-card border border-border/60 rounded-2xl p-2 space-y-1 shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b border-border/40 text-[11px] font-heading font-extrabold uppercase text-muted-foreground tracking-wider">
            Growth Engine Modules
          </div>
          <div className="space-y-0.5">
            {MODULES.map((m) => {
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

        {/* Right Scrollable Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Module 1: Campaigns */}
          {activeModule === "campaigns" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-extrabold text-foreground">Marketing Campaigns ({campaigns.length})</h2>
                  <p className="font-body text-xs text-muted-foreground">Multi-channel promotion & admission season growth campaigns</p>
                </div>
              </div>

              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-border/60 bg-card space-y-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading text-xs font-bold text-foreground">{c.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-heading font-extrabold uppercase bg-primary/10 text-primary">
                            {c.type}
                          </span>
                        </div>
                        <span className="font-body text-[10px] text-muted-foreground block">
                          Audience: {c.targetAudience} • Dates: {c.startDate} to {c.endDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaign(c.id)}
                          className={`px-3 py-1.5 rounded-lg font-heading text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            c.status === "Running"
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {c.status === "Running" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {c.status}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(c.id)}
                          className="p-1.5 rounded-lg border border-border/60 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-xs font-body">
                      <div>Spent: <strong className="font-heading text-foreground">₹{c.spent.toLocaleString()}</strong> / ₹{c.budget.toLocaleString()}</div>
                      <div>CTR: <strong className="font-heading text-primary">{c.ctr}%</strong></div>
                      <div>Conversions: <strong className="font-heading text-foreground">{c.conversions}</strong></div>
                      <div>Attributed Rev: <strong className="font-heading text-emerald-600">₹{(c.revenueGenerated / 100000).toFixed(1)}L</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module 2: Coupon Center */}
          {activeModule === "coupons" && (
            <div className="space-y-5">
              <SectionCard title="Generate New Promo Coupon" subtitle="Create discount codes for student checkout">
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-body text-xs font-semibold text-foreground block mb-1">Coupon Code</label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. INDORE500"
                        className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold uppercase"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-semibold text-foreground block mb-1">Discount Type</label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                      >
                        <option value="Flat">Flat (₹ Amount)</option>
                        <option value="Percentage">Percentage (% Off)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-xs font-semibold text-foreground block mb-1">Discount Value</label>
                      <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!couponCode.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Generate Coupon Code
                  </button>
                </form>
              </SectionCard>

              <SectionCard title="Active Promo Coupons" subtitle="List of live discount codes">
                <div className="space-y-3">
                  {coupons.map((cp) => (
                    <div key={cp.id} className="p-3.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-extrabold text-primary text-sm">{cp.code}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-heading font-extrabold text-[10px] uppercase">
                            {cp.status}
                          </span>
                        </div>
                        <span className="font-body text-[10px] text-muted-foreground block">
                          Discount: {cp.discountType === "Flat" ? `₹${cp.discountValue}` : `${cp.discountValue}%`} • Used: {cp.usedCount}/{cp.usageLimit} times
                        </span>
                      </div>
                      <span className="font-body text-xs text-muted-foreground">Expires: {cp.validUntil}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Module 3: Referral & Loyalty */}
          {activeModule === "referral" && (
            <div className="space-y-5">
              <SectionCard title="Invite & Referral Program Rules" subtitle="Reward configuration for viral user growth">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                    <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Student Referral Reward</span>
                    <span className="font-heading text-lg font-extrabold text-primary">₹500 Wallet Cash</span>
                    <span className="font-body text-[10px] text-muted-foreground block">On first move-in confirmation</span>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                    <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Owner Referral Reward</span>
                    <span className="font-heading text-lg font-extrabold text-emerald-600">₹1,000 Payout</span>
                    <span className="font-body text-[10px] text-muted-foreground block">On new property listing approval</span>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                    <span className="font-body text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Referred Users</span>
                    <span className="font-heading text-lg font-extrabold text-foreground">1,420 Students</span>
                    <span className="font-body text-[10px] text-muted-foreground block">Active on RoofOnClick</span>
                  </div>
                </div>
              </SectionCard>

              <div className="space-y-3">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Loyalty Tiers ({loyaltyTiers.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {loyaltyTiers.map((tier, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border/60 bg-card space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-extrabold text-primary">{tier.name} Tier</span>
                        <Award className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-xs font-body text-muted-foreground space-y-1">
                        <div>Cashback: <strong className="text-emerald-600 font-heading">{tier.cashbackRate}%</strong></div>
                        <div>Active Members: <strong className="text-foreground font-heading">{tier.activeUsersCount}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Module 5: Multi-Channel Broadcast */}
          {activeModule === "broadcast" && (
            <SectionCard title="Multi-Channel Message Broadcast" subtitle="Send targeted Push, WhatsApp & SMS notifications">
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Target Audience</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    >
                      <option value="Buyers / Students">Buyers / Students (Indore)</option>
                      <option value="Property Owners">Property Owners</option>
                      <option value="All Users">All Registered Users</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1">Broadcast Channel</label>
                    <select
                      value={broadcastChannel}
                      onChange={(e) => setBroadcastChannel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold"
                    >
                      <option value="WhatsApp">WhatsApp Business API</option>
                      <option value="Push">Push Notification</option>
                      <option value="Email">Email Broadcast</option>
                      <option value="SMS">SMS Gateway</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Type broadcast message (Supports tags: {{buyer_name}}, {{property_name}})..."
                    className="w-full p-3 rounded-xl border border-border/60 bg-muted/20 text-xs font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!broadcastMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Broadcast Now
                </button>
              </form>
            </SectionCard>
          )}

          {/* Other Modules Placeholder */}
          {["homepage", "segments", "aiMarketing"].includes(activeModule) && (
            <SectionCard title={`${activeModule.toUpperCase()} Module`} subtitle="Enterprise growth module ready for production integration">
              <p className="font-body text-xs text-muted-foreground">Module parameters configured and bound to production contracts.</p>
            </SectionCard>
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}
