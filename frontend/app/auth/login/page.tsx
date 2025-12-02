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
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/custom-response";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const { mutate, isPending: loading } = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: { email: string; password: string }) =>
      loginUser(data.email, data.password),
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Login successful");
        const user =
          data?.data?.user?.type === "admin" ? "/admin" : "/dashboard";
        router.push(user);
        return;
      }
      if (data?.error) {
        toast.error(data?.error?.message);

        return;
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
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
              {/* Social Login */}
            </form>
          </Card>

          {/* Sign Up Link */}

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
