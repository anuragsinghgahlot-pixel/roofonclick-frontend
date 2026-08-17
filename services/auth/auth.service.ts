/**
 * AuthService — Password Reset via Resend email link.
 */

import { apiClient } from "@/lib/api-client";

class AuthServiceImpl {
  /**
   * Mask an email for display e.g. "ad****@gmail.com"
   */
  public maskEmail(email: string): string {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.substring(0, 2)}****@${domain}`;
  }

  /**
   * POST /api/auth/forgot-password
   */
  public async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: "Please enter your email address." };
    }
    try {
      const res = await apiClient.post<null>("/api/auth/forgot-password", { email: cleanEmail });
      return { success: true, message: res.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      return { success: false, message: msg };
    }
  }

  /**
   * GET /api/auth/verify-reset-token?token=
   */
  public async verifyResetToken(
    token: string
  ): Promise<{ valid: boolean; message: string }> {
    if (!token) {
      return { valid: false, message: "No reset token provided." };
    }
    try {
      await apiClient.get(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
      return { valid: true, message: "Token is valid." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reset link is invalid or has expired.";
      return { valid: false, message: msg };
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    if (!token || !newPassword) {
      return { success: false, message: "Token and new password are required." };
    }
    try {
      const res = await apiClient.post<null>("/api/auth/reset-password", {
        token,
        password: newPassword,
      });
      return { success: true, message: res.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      return { success: false, message: msg };
    }
  }
  /** @deprecated OTP flow replaced by email-link reset. Kept for legacy verify-otp page compatibility. */
  public getActiveResetState(): null { return null; }

  /** @deprecated */
  public async resendOTP(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: "OTP reset is no longer supported. Use the email link flow." };
  }

  /** @deprecated */
  public async verifyOTP(
    _emailOrPhone: string,
    _otp: string
  ): Promise<{ success: boolean; token?: string; message: string }> {
    return { success: false, message: "OTP reset is no longer supported. Use the email link flow." };
  }
}

export const AuthService = new AuthServiceImpl();



