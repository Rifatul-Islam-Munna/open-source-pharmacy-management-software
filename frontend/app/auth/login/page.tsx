"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { ViewTransition } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add your login logic here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ViewTransition>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary-background px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded flex items-center justify-center bg-primary-blue text-white font-bold">
                P
              </div>
              <span className="font-bold text-xl text-dark-text">
                PharmaSys
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-dark-blue mb-2">
              Welcome Back
            </h1>
            <p className="text-dark-text opacity-75">
              Sign in to your pharmacy management account
            </p>
          </div>

          {/* Login Card */}
          <Card className="border border-border-gray bg-white dark:bg-light-gray rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-dark-text"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-primary-blue opacity-60"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@pharmacy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary-blue hover:text-dark-blue transition"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-primary-blue opacity-60"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="border-border-gray data-[state=checked]:bg-primary-blue data-[state=checked]:border-primary-blue"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-dark-text cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary-blue hover:bg-dark-blue text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-gray"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-light-gray text-dark-text opacity-75">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border border-border-gray bg-white dark:bg-primary-background hover:bg-light-gray dark:hover:bg-light-gray text-dark-text"
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border border-border-gray bg-white dark:bg-primary-background hover:bg-light-gray dark:hover:bg-light-gray text-dark-text"
                >
                  Microsoft
                </Button>
              </div>
            </form>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-dark-text opacity-75">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary-blue font-semibold hover:text-dark-blue transition"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Support Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-dark-text opacity-50">
              Need help?{" "}
              <Link
                href="/"
                className="text-primary-blue hover:text-dark-blue transition"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
