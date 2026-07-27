"use client";

import * as React from "react";

export type UserRole = "buyer" | "owner";

export interface User {
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  role?: UserRole;
  avatarUrl?: string;
  memberSince?: string;
  status?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  signup: (name: string, email: string, phoneNumber?: string, gender?: string, role?: UserRole) => void;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const [role, setRoleState] = React.useState<UserRole | null>(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("auth_role") || sessionStorage.getItem("auth_role");
      if (storedRole === "buyer" || storedRole === "owner") {
        return storedRole as UserRole;
      }
    }
    return null;
  });

  const signup = React.useCallback((name: string, email: string, phoneNumber?: string, gender?: string, userRole?: UserRole) => {
    const targetRole = userRole || role || undefined;
    const newUser: User = { 
      name, 
      email, 
      phone: phoneNumber, 
      phoneNumber, 
      gender, 
      role: targetRole 
    };
    setUser(newUser);
    if (targetRole) {
      setRoleState(targetRole);
    }
    if (typeof window !== "undefined") {
      const json = JSON.stringify(newUser);
      localStorage.setItem("auth_user", json);
      sessionStorage.setItem("auth_user", json);
      if (targetRole) {
        localStorage.setItem("auth_role", targetRole);
        sessionStorage.setItem("auth_role", targetRole);
      }
    }
  }, [role]);

  const login = React.useCallback((email: string) => {
    if (typeof window !== "undefined") {
      let existingUser: User | null = null;
      try {
        const storedUser = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
        if (storedUser) existingUser = JSON.parse(storedUser);
      } catch {
        existingUser = null;
      }

      // Default name derived from email if no previous name exists
      const defaultName = email.includes("@")
        ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : email;

      const storedRole = (localStorage.getItem("auth_role") || sessionStorage.getItem("auth_role")) as UserRole | null;

      const loggedInUser: User = {
        name: (existingUser?.email === email && existingUser?.name) ? existingUser.name : defaultName,
        email,
        role: existingUser?.role || storedRole || undefined,
        avatarUrl: existingUser?.email === email ? existingUser?.avatarUrl : undefined,
      };

      setUser(loggedInUser);
      if (storedRole) {
        setRoleState(storedRole);
      }

      const json = JSON.stringify(loggedInUser);
      localStorage.setItem("auth_user", json);
      sessionStorage.setItem("auth_user", json);
    }
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    setRoleState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_role");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_role");
    }
  }, []);

  const setRole = React.useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_role", newRole);
      sessionStorage.setItem("auth_role", newRole);

      setUser((prev) => {
        if (!prev) return null;
        const updated: User = { ...prev, role: newRole };
        const json = JSON.stringify(updated);
        localStorage.setItem("auth_user", json);
        sessionStorage.setItem("auth_user", json);
        return updated;
      });
    }
  }, []);

  const updateUser = React.useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      const base: User = prev || { name: "Guest", email: "user@example.com" };
      const updated: User = { ...base, ...updatedFields };
      if (typeof window !== "undefined") {
        const json = JSON.stringify(updated);
        localStorage.setItem("auth_user", json);
        sessionStorage.setItem("auth_user", json);
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setRole, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
