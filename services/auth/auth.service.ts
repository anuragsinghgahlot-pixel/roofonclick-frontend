/**
 * Reusable AuthService for Password Reset & OTP Verification flow.
 * Structured to easily swap mock dev logic for a real backend API endpoint.
 */

export interface ResetState {
  email: string; // Mapped to emailOrPhone for backward compatibility
  emailOrPhone: string;
  method: "email" | "phone";
  isVerified: boolean;
  otp: string;
  token?: string;
  requestedAt: number;
}

const RESET_STATE_KEY = "roofonclick_reset_password_state";
const DEFAULT_DEV_OTP = "123456";

class AuthServiceImpl {
  private safeGetResetState(): ResetState | null {
    if (typeof window === "undefined") return null;
    try {
      const data = sessionStorage.getItem(RESET_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private safeSetResetState(state: ResetState | null): void {
    if (typeof window === "undefined") return;
    try {
      if (state) {
        sessionStorage.setItem(RESET_STATE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.removeItem(RESET_STATE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Helper to mask a recovery destination (email or phone)
   */
  public maskValue(value: string, method: "email" | "phone"): string {
    if (!value) return "";
    if (method === "email") {
      const [local, domain] = value.split("@");
      if (!local || !domain) return value;
      if (local.length <= 2) {
        return `${local[0]}***@${domain}`;
      }
      return `${local.substring(0, 2)}****@${domain}`;
    } else {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length < 4) return value;
      return `${cleaned.substring(0, 2)}******${cleaned.substring(cleaned.length - 2)}`;
    }
  }

  /**
   * 1. Request Password Reset (Forgot Password)
   * Sends OTP to the provided email address or phone number.
   */
  public async requestPasswordReset(
    emailOrPhone: string,
    method: "email" | "phone"
  ): Promise<{ success: boolean; message: string }> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanInput = emailOrPhone.trim();
    if (!cleanInput) {
      return { 
        success: false, 
        message: `Please enter your ${method === "email" ? "email address" : "phone number"}.` 
      };
    }

    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanInput.toLowerCase())) {
        return { success: false, message: "Please enter a valid email address format." };
      }
    } else {
      if (!/^\d{10}$/.test(cleanInput)) {
        return { success: false, message: "Phone number must be exactly 10 digits and numeric only." };
      }
    }

    const state: ResetState = {
      email: cleanInput.toLowerCase(),
      emailOrPhone: cleanInput,
      method,
      isVerified: false,
      otp: DEFAULT_DEV_OTP,
      requestedAt: Date.now(),
    };

    this.safeSetResetState(state);
    const masked = this.maskValue(cleanInput, method);
    return {
      success: true,
      message: `A 6-digit OTP has been sent to ${masked}. (Use dev code: 123456)`,
    };
  }

  /**
   * 2. Resend OTP
   */
  public async resendOTP(emailOrPhone?: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const current = this.safeGetResetState();
    const targetValue = (emailOrPhone || current?.emailOrPhone || current?.email || "").trim();
    const method = current?.method || (targetValue.includes("@") ? "email" : "phone");

    if (!targetValue) {
      return { success: false, message: "Recovery session expired. Please start over." };
    }

    const state: ResetState = {
      email: targetValue.toLowerCase(),
      emailOrPhone: targetValue,
      method,
      isVerified: false,
      otp: DEFAULT_DEV_OTP,
      requestedAt: Date.now(),
    };

    this.safeSetResetState(state);
    const masked = this.maskValue(targetValue, method);
    return {
      success: true,
      message: `A new 6-digit OTP code was sent to ${masked}. (Use dev code: 123456)`,
    };
  }

  /**
   * 3. Verify OTP
   */
  public async verifyOTP(emailOrPhone: string, otp: string): Promise<{ success: boolean; token?: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const current = this.safeGetResetState();
    const cleanOtp = otp.trim();

    if (!current && cleanOtp !== DEFAULT_DEV_OTP) {
      return { success: false, message: "Reset session expired. Please request a new OTP." };
    }

    // Mock validation: accepts default dev OTP "123456" or matching stored OTP or any 6-digit number in dev mode
    const isValid = cleanOtp === DEFAULT_DEV_OTP || (current?.otp && cleanOtp === current.otp) || cleanOtp.length === 6;

    if (!isValid) {
      return { success: false, message: "Invalid 6-digit OTP code. Please try again." };
    }

    const resetToken = `token_${Math.random().toString(36).substring(2, 10)}`;
    const targetValue = current?.emailOrPhone || emailOrPhone || "user@example.com";
    const method = current?.method || (targetValue.includes("@") ? "email" : "phone");

    const updatedState: ResetState = {
      email: targetValue.toLowerCase(),
      emailOrPhone: targetValue,
      method,
      isVerified: true,
      otp: cleanOtp,
      token: resetToken,
      requestedAt: current?.requestedAt || Date.now(),
    };

    this.safeSetResetState(updatedState);

    return {
      success: true,
      token: resetToken,
      message: "OTP verified successfully. You may now reset your password.",
    };
  }

  /**
   * 4. Reset Password
   */
  public async resetPassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const current = this.safeGetResetState();
    if (!current?.isVerified) {
      return { success: false, message: "OTP verification required before resetting password." };
    }

    if (newPassword.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long." };
    }

    // Clear reset session on success
    this.safeSetResetState(null);

    return {
      success: true,
      message: "Your password has been reset successfully. You can now sign in with your new password.",
    };
  }

  /**
   * Helper to retrieve active reset state
   */
  public getActiveResetState(): ResetState | null {
    return this.safeGetResetState();
  }

  /**
   * Clear reset session state
   */
  public clearResetState(): void {
    this.safeSetResetState(null);
  }
}

export const AuthService = new AuthServiceImpl();
