"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Key,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  KpiCard,
  SectionCard,
} from "@/components/admin";
import type { ColumnDef, RowAction } from "@/components/admin/data-table";

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Operations" | "Verification" | "Finance" | "Support" | "Marketing";
  department: "Operations" | "Finance" | "Support" | "Verification" | "Marketing";
  status: "Active" | "Inactive";
  lastLogin: string;
  twoFactorEnabled: boolean;
}

const MOCK_ADMINS: AdminUserRecord[] = [
  { id: "ADM-1", name: "Anurag Singh Gahlot", email: "super.admin@roofonclick.com", role: "Super Admin", department: "Operations", status: "Active", lastLogin: "Just now", twoFactorEnabled: true },
  { id: "ADM-2", name: "Rohit Sharma", email: "rohit.s@roofonclick.com", role: "Operations", department: "Operations", status: "Active", lastLogin: "10 mins ago", twoFactorEnabled: true },
  { id: "ADM-3", name: "Priya Verma", email: "priya.v@roofonclick.com", role: "Verification", department: "Verification", status: "Active", lastLogin: "1 hour ago", twoFactorEnabled: true },
  { id: "ADM-4", name: "Siddharth Jain", email: "siddharth.j@roofonclick.com", role: "Finance", department: "Finance", status: "Active", lastLogin: "Yesterday", twoFactorEnabled: true },
];

export default function AdminAdminsPage() {
  const [admins, setAdmins] = React.useState<AdminUserRecord[]>(MOCK_ADMINS);
  const [selectedAdmin, setSelectedAdmin] = React.useState<AdminUserRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  /* Invite Form State */
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<AdminUserRecord["role"]>("Operations");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newAdmin: AdminUserRecord = {
      id: `ADM-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      department: "Operations",
      status: "Active",
      lastLogin: "Never",
      twoFactorEnabled: true,
    };
    setAdmins((prev) => [newAdmin, ...prev]);
    setInviteName("");
    setInviteEmail("");
    setIsInviteModalOpen(false);
    toast.success(`Invite sent to ${newAdmin.email}!`);
  };

  const columns: ColumnDef<AdminUserRecord>[] = [
    {
      id: "id",
      header: "Admin ID",
      sortable: true,
      minWidth: "120px",
      accessor: (a) => a.id,
      cell: (val, row) => (
        <button type="button" onClick={() => { setSelectedAdmin(row); setIsDrawerOpen(true); }} className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer">
          {String(val)}
        </button>
      ),
    },
    {
      id: "name",
      header: "Name & Email",
      sortable: true,
      minWidth: "180px",
      accessor: (a) => a.name,
      cell: (val, row) => (
        <div>
          <span className="font-heading text-xs font-bold text-foreground block">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block">{row.email}</span>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      sortable: true,
      minWidth: "130px",
      accessor: (a) => a.role,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase bg-primary/10 text-primary">
          {String(val)}
        </span>
      ),
    },
    { id: "dept", header: "Department", sortable: true, minWidth: "130px", accessor: (a) => a.department },
    {
      id: "2fa",
      header: "2FA Status",
      sortable: true,
      minWidth: "110px",
      accessor: (a) => a.twoFactorEnabled,
      cell: (val) => (
        <span className="px-2 py-0.5 rounded font-heading text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700">
          {val ? "Enabled" : "Disabled"}
        </span>
      ),
    },
    { id: "login", header: "Last Login", sortable: true, minWidth: "130px", accessor: (a) => a.lastLogin },
  ];

  return (
    <AdminPageContainer>
      <PageHeader
        title="Admin CRM & Role Permission Center"
        subtitle="Manage platform super admins, operations team members, roles & 2FA security status"
        actions={
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite New Admin</span>
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Admins" value={admins.length} formattedValue={String(admins.length)} change={0} changeType="neutral" comparisonLabel="staff members" icon={ShieldCheck} />
        <KpiCard label="Super Admins" value={1} formattedValue="1 Member" change={0} changeType="neutral" comparisonLabel="full access" icon={Key} />
        <KpiCard label="Operations Team" value={admins.filter(a => a.department === "Operations").length} formattedValue={String(admins.filter(a => a.department === "Operations").length)} change={0} changeType="neutral" comparisonLabel="ops managers" icon={Users} />
        <KpiCard label="2FA Enabled" value={100} formattedValue="100%" change={0} changeType="neutral" comparisonLabel="security compliance" icon={Lock} />
      </div>

      <DataTable<AdminUserRecord>
        columns={columns}
        data={admins}
        getRowId={(a) => a.id}
        searchable={true}
        searchPlaceholder="Search admin name, email, or role..."
        rowActions={[
          { id: "inspect", label: "Inspect Admin Profile", icon: Eye, onClick: (a) => { setSelectedAdmin(a); setIsDrawerOpen(true); } },
        ]}
      />

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInviteModalOpen(false)} className="fixed inset-0 z-[499] bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[500] w-full max-w-md p-6 bg-card border border-border/80 rounded-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-heading text-base font-extrabold text-foreground">Invite New Admin Member</h3>
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-3">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Full Name</label>
                  <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. Rahul Sharma" className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Email Address</label>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="e.g. rahul@roofonclick.com" className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1">Admin Role</label>
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-border/60 bg-muted/20 text-xs font-heading font-semibold">
                    <option value="Operations">Operations Manager</option>
                    <option value="Verification">Verification Manager</option>
                    <option value="Finance">Finance Auditor</option>
                    <option value="Support">Support Agent</option>
                    <option value="Marketing">Marketing Manager</option>
                  </select>
                </div>
                <button type="submit" disabled={!inviteName.trim() || !inviteEmail.trim()} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold transition-all cursor-pointer">
                  Send Invitation Email
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedAdmin && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[500px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{selectedAdmin.id}</span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">{selectedAdmin.name}</h2>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 text-xs font-body">
                  <div>Email: <strong className="font-heading text-foreground">{selectedAdmin.email}</strong></div>
                  <div>Role: <strong className="font-heading text-primary">{selectedAdmin.role}</strong></div>
                  <div>Department: <strong className="font-heading text-foreground">{selectedAdmin.department}</strong></div>
                  <div>2FA Status: <strong className="font-heading text-emerald-600">Enabled</strong></div>
                  <div>Last Login: <strong className="font-heading text-foreground">{selectedAdmin.lastLogin}</strong></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
