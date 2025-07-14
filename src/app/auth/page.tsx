"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "./authShell";
import EmailInput from "./EmailInput";
import { checkUserExists, requestSignupOtp } from "../../api/services/auth";
import type { CheckUserExistsResponse } from "../../api/services/auth";

export default function AuthEntryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result: CheckUserExistsResponse = await checkUserExists(email);
      if (!result.status) {
        setError(result.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      if (result.data.exists) {
        router.push(`/auth/login?email=${encodeURIComponent(email)}`);
      } else {
        const otpResult = await requestSignupOtp(email) as { status: boolean; message?: string };
        if (!otpResult.status) {
          setError(otpResult.message || "Failed to request OTP. Please try again.");
          setLoading(false);
          return;
        }
        router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
      }
    } catch (err: unknown) {
      console.error("checkUserExists error", err);
      if (err && typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        setError((err as { message: string }).message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome to PlanWise"
      subtitle="Enter your email to get started"
    >
      <EmailInput
        value={email}
        onChange={setEmail}
        onSubmit={handleEmailSubmit}
        buttonText={loading ? "Checking..." : "Continue"}
      />
      {error && (
        <p className="text-sm text-red-500 text-center mt-2">{error}</p>
      )}
    </AuthShell>
  );
} 