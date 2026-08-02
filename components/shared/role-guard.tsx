"use client";

import * as React from "react";
import { useAuth, UserRole } from "@/providers/auth-provider";

export type RoleType = UserRole | "guest";

/**
 * Returns the current authenticated role ("buyer", "owner", or "guest").
 */
export function useCurrentRole(): RoleType {
  const { user, role } = useAuth();
  if (!user) return "guest";
  return user.role || role || "buyer";
}

/**
 * Helper hook to check if the current user is an Owner.
 */
export function useIsOwner(): boolean {
  const currentRole = useCurrentRole();
  return currentRole === "owner";
}

/**
 * Helper hook to check if the current user is a Buyer/Guest.
 */
export function useIsBuyer(): boolean {
  const currentRole = useCurrentRole();
  return currentRole === "buyer" || currentRole === "guest";
}

interface RoleGuardProps {
  /** Array of allowed roles for rendering children (e.g. ["owner"], ["buyer"]) */
  roles: RoleType[];
  /** Elements to render when role matches */
  children: React.ReactNode;
  /** Optional fallback node when role does not match */
  fallback?: React.ReactNode;
}

/**
 * RoleGuard component that conditionally renders children based on authorized roles.
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const currentRole = useCurrentRole();

  if (roles.includes(currentRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
