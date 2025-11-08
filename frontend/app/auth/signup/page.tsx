"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Store,
  User,
  MapPin,
  Mail,
  Lock,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { ViewTransition } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    shopName: "",
    username: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);

  const basePrice = 249;

  const getDiscount = () => {
    if (months >= 12) return 0.4;
    if (months >= 6) return 0.3;
    if (months >= 3) return 0.2;
    return 0;
  };

  const discount = getDiscount();
  const totalPrice = basePrice * months * (1 - discount);
  const monthlyPrice = totalPrice / months;
  const savedAmount = basePrice * months - totalPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.shopName ||
      !formData.username ||
      !formData.location ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    console.log("Signup data:", {
      ...formData,
      months,
      totalPrice,
      basePrice,
      discount: `${(discount * 100).toFixed(0)}%`,
    });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <ViewTransition>
      <div className="min-h-screen bg-white dark:bg-primary-background">
        {/* Header */}
        <div className="border-b border-border-gray bg-white dark:bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-primary-blue text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold text-lg text-dark-text">
                PharmaSys
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-180px)]">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-start">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-blue mb-2">
                  Create Your Account
                </h1>
                <p className="text-dark-text opacity-75">
                  Get started with PharmaSys today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Shop Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="shopName"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Shop Name
                  </Label>
                  <div className="relative">
                    <Store
                      className="absolute left-3 top-3 text-primary-blue opacity-60"
                      size={18}
                    />
                    <Input
                      id="shopName"
                      name="shopName"
                      type="text"
                      placeholder="Modern Pharmacy"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-3 text-primary-blue opacity-60"
                      size={18}
                    />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="john_pharmacy"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-primary-blue opacity-60"
                      size={18}
                    />
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Dhaka, Bangladesh"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
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
                      name="email"
                      type="email"
                      placeholder="you@pharmacy.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-primary-blue opacity-60"
                      size={18}
                    />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-dark-text"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-3 text-primary-blue opacity-60"
                      size={18}
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 h-10 border border-border-gray bg-white dark:bg-primary-background dark:border-border-gray text-dark-text placeholder:opacity-50 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Subscription Duration */}
                <div className="space-y-3 mt-6 pt-6 border-t border-border-gray">
                  <Label className="text-sm font-semibold text-dark-text">
                    Subscription Duration
                  </Label>

                  <div className="flex items-center gap-2 bg-light-gray dark:bg-primary-background border border-border-gray rounded-lg p-2 w-fit">
                    <button
                      type="button"
                      onClick={() => setMonths(Math.max(1, months - 1))}
                      className="p-1 text-primary-blue hover:bg-border-gray rounded transition"
                    >
                      <Minus size={16} />
                    </button>

                    <div className="text-center px-4">
                      <div className="text-lg font-bold text-dark-blue w-12">
                        {months}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMonths(months + 1)}
                      className="p-1 text-primary-blue hover:bg-border-gray rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary-blue hover:bg-dark-blue text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 mt-8"
                >
                  {loading ? "Processing..." : "Continue to Payment"}
                  {!loading && <ArrowRight size={18} />}
                </Button>

                {/* Sign In Link */}
                <div className="text-center text-sm">
                  <p className="text-dark-text opacity-75">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-primary-blue font-semibold hover:text-dark-blue transition"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Pricing Summary (Sticky) */}
            <div className="hidden lg:flex flex-col justify-start pl-4 border-l border-border-gray">
              <Card className="border border-border-gray bg-light-gray dark:bg-primary-background rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-dark-blue mb-6">
                  Order Summary
                </h2>

                {/* Details */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border-gray">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">
                      Shop Name:
                    </span>
                    <span className="font-semibold text-dark-text">
                      {formData.shopName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">Username:</span>
                    <span className="font-semibold text-dark-text">
                      {formData.username || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">Email:</span>
                    <span className="font-semibold text-dark-text text-right break-all max-w-[200px]">
                      {formData.email || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">Location:</span>
                    <span className="font-semibold text-dark-text text-right">
                      {formData.location || "—"}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border-gray">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">
                      Base Price:
                    </span>
                    <span className="font-semibold text-dark-text">
                      ${basePrice.toFixed(2)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-text opacity-75">Duration:</span>
                    <span className="font-semibold text-dark-text">
                      {months} {months === 1 ? "month" : "months"}
                    </span>
                  </div>

                  {discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-text opacity-75">
                          Subtotal:
                        </span>
                        <span className="text-dark-text">
                          ${(basePrice * months).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-success">Discount:</span>
                        <span className="font-semibold text-success">
                          -${savedAmount.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Total */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-dark-blue">Total:</span>
                    <span className="text-3xl font-bold text-primary-blue">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-dark-text opacity-75 text-right">
                    ${monthlyPrice.toFixed(2)}/month effective
                  </p>
                </div>

                {/* Security Notice */}
                <div className="mt-6 pt-6 border-t border-border-gray text-center">
                  <p className="text-xs text-dark-text opacity-50">
                    🔒 Secure & Encrypted
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile Pricing (shown only on mobile) */}
          <div className="lg:hidden mt-8">
            <Card className="border border-border-gray bg-light-gray dark:bg-primary-background rounded-xl p-6">
              <h2 className="text-lg font-bold text-dark-blue mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 pb-4 border-b border-border-gray">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-text opacity-75">Base Price:</span>
                  <span className="font-semibold">
                    ${basePrice.toFixed(2)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-text opacity-75">Duration:</span>
                  <span className="font-semibold">
                    {months} {months === 1 ? "month" : "months"}
                  </span>
                </div>

                {discount > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-text opacity-75">
                        Subtotal:
                      </span>
                      <span>${(basePrice * months).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Discount:</span>
                      <span className="font-semibold text-success">
                        -${savedAmount.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-dark-blue">Total:</span>
                <span className="text-2xl font-bold text-primary-blue">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
