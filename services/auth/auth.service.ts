/**
 * AuthService — Password Reset helpers.
 *
 * NOTE: The backend does not currently have a forgot-password/OTP endpoint.
 * These methods are stubs that surface a "coming soon" message.
 * They will be wired to real API calls once the backend adds this feature.
 */

export interface ResetState {
  email: string;
  emailOrPhone: string;
  method: "email" | "phone";
  isVerified: boolean;
}

class AuthServiceImpl {
  /**
   * Helper to mask a recovery destination (email or phone)
   */
  public maskValue(value: string, method: "email" | "phone"): string {
    if (!value) return "";
    if (method === "email") {
      const [local, domain] = value.split("@");
      if (!local || !domain) return value;
      if (local.length <= 2) return `${local[0]}***@${domain}`;
      return `${local.substring(0, 2)}****@${domain}`;
    } else {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length < 4) return value;
      return `${cleaned.substring(0, 2)}******${cleaned.substring(cleaned.length - 2)}`;
    }
  }

  /**
   * Request Password Reset — STUB (backend endpoint not yet available)
   */
  public async requestPasswordReset(
    emailOrPhone: string,
    method: "email" | "phone"
  ): Promise<{ success: boolean; message: string }> {
    const cleanInput = emailOrPhone.trim();
    if (!cleanInput) {
      return {
        success: false,
        message: `Please enter your ${method === "email" ? "email address" : "phone number"}.`,
      };
    }
    // TODO: Call POST /api/auth/forgot-password once backend implements it
    return {
      success: false,
      message:
        "Password reset via OTP is coming soon. Please contact support to reset your password.",
    };
  }

  /**
   * Resend OTP — STUB
   */
  public async resendOTP(): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message: "Password reset via OTP is coming soon.",
    };
  }

  /**
   * Verify OTP — STUB
   */
  public async verifyOTP(
    _emailOrPhone: string,
    _otp: string
  ): Promise<{ success: boolean; token?: string; message: string }> {
    return {
      success: false,
      message: "OTP verification is coming soon.",
    };
  }

  /**
   * Reset Password — STUB
   */
  public async resetPassword(
    _newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: false,
      message: "Password reset is coming soon.",
    };
  }

  /**
   * Legacy compat: returns null since there is no active reset session.
   */
  public getActiveResetState(): null {
    return null;
  }

  /** Legacy compat: no-op */
  public clearResetState(): void {}
}

export const AuthService = new AuthServiceImpl();
