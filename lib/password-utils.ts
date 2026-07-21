/**
 * Password strength calculation and validation utility.
 */

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export type StrengthLevel = "Weak" | "Fair" | "Good" | "Strong";

export interface PasswordStrengthResult {
  score: number; // 0 to 5
  level: StrengthLevel;
  color: string;
  textColor: string;
  widthPercent: number;
  requirements: PasswordRequirement[];
  isStrongEnough: boolean; // Fair, Good, or Strong (at least 8 chars & score >= 2)
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const requirements: PasswordRequirement[] = [
    {
      id: "length",
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "One number",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "One special character (!@#$%^&*)",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const score = requirements.filter((r) => r.met).length;

  let level: StrengthLevel = "Weak";
  let color = "bg-rose-500";
  let textColor = "text-rose-500";
  let widthPercent = 25;

  if (!password || password.length === 0) {
    level = "Weak";
    color = "bg-rose-500";
    textColor = "text-rose-500";
    widthPercent = 0;
  } else if (score <= 1 || password.length < 6) {
    level = "Weak";
    color = "bg-rose-500";
    textColor = "text-rose-500";
    widthPercent = 25;
  } else if (score === 2 || score === 3) {
    level = "Fair";
    color = "bg-amber-500";
    textColor = "text-amber-600";
    widthPercent = 50;
  } else if (score === 4) {
    level = "Good";
    color = "bg-sky-500";
    textColor = "text-sky-600";
    widthPercent = 75;
  } else {
    level = "Strong";
    color = "bg-emerald-500";
    textColor = "text-emerald-600";
    widthPercent = 100;
  }

  return {
    score,
    level,
    color,
    textColor,
    widthPercent,
    requirements,
    isStrongEnough: score >= 2 && password.length >= 8,
  };
}
