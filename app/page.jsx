
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "./src/store/authStore";

export default function AdminLoginPage() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = await login(phoneNumber, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09000f] text-white">
      <Image
        src="/gradient.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/15" />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="flex items-baseline gap-1 text-white no-underline"
        >
          <span className="text-2xl font-extrabold tracking-[-1.5px]">
            postam
          </span>

          <span className="text-[10px]">admin</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-white no-underline transition hover:text-violet-300 sm:text-sm"
        >
          Back to Homepage
          <ArrowRight size={16} />
          <span className="text-lg font-bold text-indigo-400">P</span>
        </Link>
      </header>

      <section className="relative z-[1] flex min-h-screen flex-col items-center px-5 pb-12 pt-32 sm:pt-36 md:pt-40">
        <h1 className="mb-6 bg-gradient-to-r from-[#d06cff] to-[#467bff] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Welcome Back
        </h1>

        <div className="w-full max-w-[440px] rounded-xl bg-white px-7 pb-8 pt-8 text-[#77748a] shadow-[0_20px_70px_rgba(0,0,0,0.3)] sm:px-10 sm:pb-10 sm:pt-9">

          <form onSubmit={handleSubmit} className="w-full">

            {/* Phone Number */}
            <div className="mb-6 flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-[#716e82]"
              >
                Phone Number*
              </label>

              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                autoComplete="username"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="h-12 w-full rounded-lg border border-[#c6b8ff] bg-white px-4 text-sm text-[#29233c] outline-none transition placeholder:text-[#aaa4bd] focus:border-[#7850e8] focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* Password */}
            <div className="mb-5 flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#716e82]"
              >
                Password
              </label>

              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-lg border border-[#c6b8ff] bg-white px-4 pr-12 text-sm text-[#29233c] outline-none transition placeholder:text-[#aaa4bd] focus:border-[#7850e8] focus:ring-4 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a18aff] transition hover:text-[#5d32d4]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#8b879c] sm:text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#6844dc]"
                />

                Remember me
              </label>

              <Link
                href="/admin/forgot-password"
                className="text-xs text-[#8b70ec] no-underline transition hover:text-[#5d32d4] sm:text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="mb-4 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#8060e9] to-[#531bc9] text-sm font-semibold text-white shadow-md shadow-violet-200/50 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>
        </div>
      </section>
    </main>
  );
}
