"use client";

import * as React from "react";

export type UserRole = "buyer" | "owner";

interface AuthContextType {
  user: { name?: string; email?: string; role?: UserRole } | null;
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  signup: (name: string, email: string) => void;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<{ name?: string; email?: string; role?: UserRole } | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("auth_user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [role, setRoleState] = React.useState<UserRole | null>(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("auth_role");
      if (storedRole) {
        return storedRole as UserRole;
      }
    }
    return null;
  });

  const signup = React.useCallback((name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_user", JSON.stringify(newUser));
    }
  }, []);

  const login = React.useCallback((email: string) => {
    const loggedInUser = { email };
    setUser(loggedInUser);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_user", JSON.stringify(loggedInUser));
      const storedRole = sessionStorage.getItem("auth_role");
      if (storedRole) {
        setRoleState(storedRole as UserRole);
      }
    }
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    setRoleState(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_role");
    }
  }, []);

  const setRole = React.useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_role", newRole);
      // Also update user object if present
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, role: newRole };
        sessionStorage.setItem("auth_user", JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setRole, signup, login, logout }}>
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
