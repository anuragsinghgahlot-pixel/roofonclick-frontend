"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Star,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Building,
  User,
  X,
  Send,
  ThumbsUp,
} from "lucide-react";
import {
  AdminPageContainer,
  PageHeader,
  DataTable,
  KpiCard,
} from "@/components/admin";
import type { ColumnDef, RowAction, BulkAction } from "@/components/admin/data-table";

interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  propertyTitle: string;
  rating: number; // 1-5
  comment: string;
  ownerReply?: string;
  status: "Approved" | "Pending" | "Hidden" | "Reported";
  reasonReported?: string;
  createdAt: string;
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: "REV-101",
    reviewerName: "Anurag Singh Gahlot",
    reviewerEmail: "anurag@email.com",
    propertyTitle: "Elite Residency PG & Hostel",
    rating: 5,
    comment: "Spacious rooms, high-speed Wi-Fi, and top-tier food quality. Highly recommended for students!",
    ownerReply: "Thank you Anurag! We are delighted to host you.",
    status: "Approved",
    createdAt: "2026-08-01 14:20",
  },
  {
    id: "REV-102",
    reviewerName: "Sneha Mukherjee",
    reviewerEmail: "sneha@email.com",
    propertyTitle: "Shree Comfort Stay Girls PG",
    rating: 4,
    comment: "Great security and clean mess. Minor water pressure issue on the 3rd floor.",
    status: "Approved",
    createdAt: "2026-07-28 11:10",
  },
  {
    id: "REV-103",
    reviewerName: "Kunal Sharma",
    reviewerEmail: "kunal@email.com",
    propertyTitle: "Royal Residency",
    rating: 1,
    comment: "Terrible experience, food was terrible and caretaker was very rude!",
    status: "Reported",
    reasonReported: "Abusive Language / Owner Dispute",
    createdAt: "2026-07-24 16:30",
  },
  {
    id: "REV-104",
    reviewerName: "Bot Account",
    reviewerEmail: "bot@spam.com",
    propertyTitle: "Elite Residency PG & Hostel",
    rating: 5,
    comment: "Visit http://cheap-rooms.com for cheap bookings!",
    status: "Hidden",
    reasonReported: "Spam Link",
    createdAt: "2026-08-02 09:00",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(MOCK_REVIEWS);
  const [selectedReview, setSelectedReview] = React.useState<ReviewItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");

  const handleOpenDrawer = (review: ReviewItem) => {
    setSelectedReview(review);
    setReplyText(review.ownerReply || "");
    setIsDrawerOpen(true);
  };

  const handleApprove = (review: ReviewItem) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "Approved" } : r))
    );
    toast.success(`Review ${review.id} approved.`);
  };

  const handleHide = (review: ReviewItem) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, status: "Hidden" } : r))
    );
    toast.info(`Review ${review.id} hidden from public listing.`);
  };

  const handleDelete = (review: ReviewItem) => {
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
    toast.error(`Review ${review.id} deleted.`);
  };

  const columns: ColumnDef<ReviewItem>[] = [
    {
      id: "id",
      header: "Review ID",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.id,
      cell: (val, row) => (
        <button
          type="button"
          onClick={() => handleOpenDrawer(row)}
          className="font-heading text-xs font-bold text-primary hover:text-accent cursor-pointer"
        >
          {String(val)}
        </button>
      ),
    },
    {
      id: "reviewer",
      header: "Reviewer",
      sortable: true,
      minWidth: "160px",
      accessor: (r) => r.reviewerName,
      cell: (val, row) => (
        <div>
          <span className="font-heading text-xs font-bold text-foreground block">{String(val)}</span>
          <span className="font-body text-[10px] text-muted-foreground block">{row.reviewerEmail}</span>
        </div>
      ),
    },
    {
      id: "property",
      header: "Property",
      sortable: true,
      minWidth: "180px",
      accessor: (r) => r.propertyTitle,
    },
    {
      id: "rating",
      header: "Rating",
      sortable: true,
      minWidth: "100px",
      accessor: (r) => r.rating,
      cell: (val) => (
        <span className="font-heading text-xs font-bold text-amber-600 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {Number(val)} / 5
        </span>
      ),
    },
    {
      id: "comment",
      header: "Review Content",
      minWidth: "250px",
      accessor: (r) => r.comment,
      cell: (val) => (
        <p className="font-body text-xs text-foreground line-clamp-2">&quot;{String(val)}&quot;</p>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.status,
      cell: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-lg border font-heading text-[10px] font-extrabold uppercase ${
            val === "Approved"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : val === "Reported"
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      id: "date",
      header: "Date",
      sortable: true,
      minWidth: "120px",
      accessor: (r) => r.createdAt,
    },
  ];

  const rowActions: RowAction<ReviewItem>[] = [
    {
      id: "inspect",
      label: "Inspect Review",
      icon: Eye,
      onClick: (r) => handleOpenDrawer(r),
    },
    {
      id: "approve",
      label: "Approve Review",
      icon: CheckCircle2,
      variant: "success",
      onClick: (r) => handleApprove(r),
    },
    {
      id: "hide",
      label: "Hide Review",
      icon: EyeOff,
      variant: "warning",
      onClick: (r) => handleHide(r),
    },
    {
      id: "delete",
      label: "Delete Review",
      icon: Trash2,
      variant: "destructive",
      onClick: (r) => handleDelete(r),
    },
  ];

  const bulkActions: BulkAction<ReviewItem>[] = [
    {
      id: "b-approve",
      label: "Approve Selected",
      icon: CheckCircle2,
      variant: "success",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setReviews((prev) => prev.map((r) => (ids.has(r.id) ? { ...r, status: "Approved" } : r)));
        toast.success(`Approved ${rows.length} reviews.`);
      },
    },
    {
      id: "b-hide",
      label: "Hide Selected",
      icon: EyeOff,
      variant: "warning",
      onClick: (rows) => {
        const ids = new Set(rows.map((r) => r.id));
        setReviews((prev) => prev.map((r) => (ids.has(r.id) ? { ...r, status: "Hidden" } : r)));
        toast.info(`Hidden ${rows.length} reviews.`);
      },
    },
  ];

  return (
    <AdminPageContainer>
      <PageHeader
        title="Review Moderation Center"
        subtitle="Manage student property reviews, ratings, owner replies & moderation actions"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Reviews" value={reviews.length} formattedValue={String(reviews.length)} change={14} changeType="positive" comparisonLabel="total reviews" icon={Star} />
        <KpiCard label="Pending Audit" value={reviews.filter(r => r.status === "Reported" || r.status === "Pending").length} formattedValue={String(reviews.filter(r => r.status === "Reported" || r.status === "Pending").length)} change={0} changeType="neutral" comparisonLabel="needs review" icon={ShieldAlert} />
        <KpiCard label="Avg Rating" value={4.8} formattedValue="4.8 / 5" change={2.1} changeType="positive" comparisonLabel="satisfaction" icon={Star} />
        <KpiCard label="Approved Rate" value={96} formattedValue="96%" change={1} changeType="positive" comparisonLabel="approval" icon={CheckCircle2} />
      </div>

      {/* Data Table */}
      <DataTable<ReviewItem>
        columns={columns}
        data={reviews}
        getRowId={(r) => r.id}
        searchable={true}
        searchPlaceholder="Search reviewer, property title, or comment..."
        selectable={true}
        rowActions={rowActions}
        bulkActions={bulkActions}
      />

      {/* Right Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedReview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-[299] bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }} className="fixed top-0 right-0 z-[300] h-screen w-full sm:w-[500px] bg-card border-l border-border/60 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div>
                    <span className="font-heading text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">{selectedReview.id}</span>
                    <h2 className="font-heading text-base font-extrabold text-foreground mt-1">Review Inspection</h2>
                  </div>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3 text-xs font-body">
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
                    <span className="font-heading font-bold text-foreground block">{selectedReview.reviewerName}</span>
                    <span className="text-muted-foreground block">{selectedReview.reviewerEmail}</span>
                    <span className="font-heading text-amber-600 font-bold flex items-center gap-1 mt-1"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {selectedReview.rating} / 5 Stars</span>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40 space-y-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground block uppercase">Property</span>
                    <span className="font-heading text-xs font-bold text-foreground block">{selectedReview.propertyTitle}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-border/60 space-y-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground block uppercase">Comment</span>
                    <p className="font-body text-xs text-foreground italic">&quot;{selectedReview.comment}&quot;</p>
                  </div>

                  {selectedReview.reasonReported && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive space-y-1">
                      <span className="font-heading text-xs font-bold uppercase block flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Flagged Reason</span>
                      <p className="font-body text-xs">{selectedReview.reasonReported}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center gap-2">
                <button type="button" onClick={() => { handleApprove(selectedReview); setIsDrawerOpen(false); }} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-heading text-xs font-bold cursor-pointer">Approve</button>
                <button type="button" onClick={() => { handleHide(selectedReview); setIsDrawerOpen(false); }} className="flex-1 py-2 rounded-xl bg-amber-500 text-white font-heading text-xs font-bold cursor-pointer">Hide</button>
                <button type="button" onClick={() => { handleDelete(selectedReview); setIsDrawerOpen(false); }} className="px-3 py-2 rounded-xl bg-destructive text-white font-heading text-xs font-bold cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminPageContainer>
  );
}
