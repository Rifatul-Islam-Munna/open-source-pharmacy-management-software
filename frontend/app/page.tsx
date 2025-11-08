"use client";

import { ModeToggle } from "@/components/custom/themeing/Theme-Button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Lock,
  CheckCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full" style={{ backgroundColor: "var(--color-white)" }}>
      {/* Header */}
      <header
        style={{
          borderBottomColor: "var(--color-border-gray)",
          borderBottom: "1px solid var(--color-border-gray)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-white"
                style={{ backgroundColor: "var(--color-primary-blue)" }}
              >
                P
              </div>
              <span
                className="font-semibold"
                style={{ color: "var(--color-dark-text)" }}
              >
                PharmaSys
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-sm transition"
                style={{ color: "var(--color-dark-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-dark-text)")
                }
              >
                Home
              </a>
              <a
                href="#"
                className="text-sm transition"
                style={{ color: "var(--color-dark-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-dark-text)")
                }
              >
                How it Works
              </a>
              <a
                href="#"
                className="text-sm transition"
                style={{ color: "var(--color-dark-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-dark-text)")
                }
              >
                Pricing
              </a>
            </nav>
            <AnimatedThemeToggler />

            <div className="flex items-center gap-3">
              <button
                className="text-sm font-medium transition"
                style={{ color: "var(--color-dark-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary-blue)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-dark-text)")
                }
              >
                <Link href={"/auth/login"}>Login</Link>
              </button>
              <button
                className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition"
                style={{ backgroundColor: "var(--color-primary-blue)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1a7bc2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary-blue)")
                }
              >
                <Link href={"/auth/signup"}>Sign Up</Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1
                className="text-4xl md:text-5xl font-bold leading-tight text-dark-blue"
                /* style={{ color: "var(--color-dark-blue)" }} */
              >
                The Future of Pharmacy Management is Here
              </h1>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--color-dark-text)" }}
              >
                Streamline operations, manage inventory, and improve patient
                care with our all-in-one software solution.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button
                  className="px-6 py-3 text-white font-semibold rounded-lg flex items-center gap-2 transition"
                  style={{ backgroundColor: "var(--color-primary-blue)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1a7bc2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary-blue)")
                  }
                >
                  Get Started for Free
                  <ArrowRight size={18} />
                </button>
                <button
                  className="px-6 py-3 font-semibold rounded-lg transition"
                  style={{
                    borderColor: "var(--color-border-gray)",
                    color: "var(--color-dark-text)",
                    border: "2px solid var(--color-border-gray)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--color-primary-blue)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--color-border-gray)")
                  }
                >
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className="rounded-2xl p-6 aspect-video flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: "var(--color-light-gray)",
                  borderColor: "var(--color-border-gray)",
                  border: "1px solid var(--color-border-gray)",
                }}
              >
                <div className="space-y-3 w-full">
                  <div
                    className="h-3 rounded w-3/4"
                    style={{ backgroundColor: "var(--color-border-gray)" }}
                  ></div>
                  <div
                    className="h-2 rounded w-1/2"
                    style={{ backgroundColor: "var(--color-border-gray)" }}
                  ></div>
                  <div className="h-16 rounded mt-4"></div>
                  <div className="flex gap-2">
                    <div
                      className="h-2 rounded flex-1"
                      style={{ backgroundColor: "var(--color-border-gray)" }}
                    ></div>
                    <div
                      className="h-2 rounded flex-1"
                      style={{ backgroundColor: "var(--color-border-gray)" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-light-gray)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--color-dark-blue)" }}
            >
              Simple, All-Inclusive Pricing
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--color-dark-text)" }}
            >
              Get all features included in every plan. Choose a plan that suits
              your practice size, then scale up whenever you're ready.
            </p>
          </div>

          <div
            className="rounded-2xl p-8 md:p-12 text-white"
            style={{ backgroundColor: "var(--color-primary-blue)" }}
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm font-semibold opacity-90 mb-2">
                  PROFESSIONAL SUITE
                </p>
                <h3 className="text-5xl font-bold mb-4">$249</h3>
                <p className="text-sm opacity-90">per user per month</p>
                <p className="text-xs opacity-75 mt-2">
                  Billed annually. Save 20% vs monthly billing.
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">All features access</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">Unlimited Users</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">Priority Support</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">24/7 Phone Support</span>
                </div>
                <button
                  className="mt-6 px-6 py-2 font-semibold rounded-lg transition"
                  style={{
                    backgroundColor: "var(--color-white)",
                    color: "var(--color-primary-blue)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-light-gray)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-white)")
                  }
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--color-dark-blue)" }}
            >
              Everything you need to run a modern pharmacy
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "var(--color-dark-text)" }}
            >
              Our software is packed with features designed to streamline your
              data and provide comprehensive insights.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Inventory Management",
                desc: "Real-time stock tracking and automated reordering system",
              },
              {
                icon: FileText,
                title: "Prescription Tracking",
                desc: "Organize prescriptions with advanced search capabilities",
              },
              {
                icon: TrendingUp,
                title: "Advanced Analytics",
                desc: "Data-driven insights to optimize your pharmacy operations",
              },
              {
                icon: Users,
                title: "Automated Alerts",
                desc: "Get notifications for critical pharmacy events",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl hover:shadow-lg transition"
                style={{
                  backgroundColor: "var(--color-white)",
                  borderColor: "var(--color-border-gray)",
                  border: "1px solid var(--color-border-gray)",
                }}
              >
                <feature.icon
                  className="w-10 h-10 mb-4"
                  style={{ color: "var(--color-primary-blue)" }}
                />
                <h3
                  className="font-bold mb-2 text-lg"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm opacity-75"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Smarter Way to Work */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: "var(--color-dark-blue)" }}
            >
              A Smarter Way to Work
            </h2>
            <p className="text-lg" style={{ color: "var(--color-dark-text)" }}>
              Powerful pharmacy features built to work together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Set & Setup",
                desc: "Create your account in minutes and setup your pharmacy settings",
              },
              {
                icon: BarChart3,
                title: "Analyze Your Data",
                desc: "Second, import your inventory monitoring and get insights.",
              },
              {
                icon: TrendingUp,
                title: "Manage & Grow",
                desc: "Use our powerful dashboard to manage your pharmacy better.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl"
                style={{
                  backgroundColor: "var(--color-white)",
                  borderColor: "var(--color-border-gray)",
                  border: "1px solid var(--color-border-gray)",
                }}
              >
                <item.icon
                  className="w-12 h-12 mb-4"
                  style={{ color: "var(--color-primary-blue)" }}
                />
                <h3
                  className="font-bold mb-3 text-lg"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm opacity-75"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Potential */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--color-dark-blue)" }}
              >
                Unlock Your Pharmacy's Profit Potential
              </h2>

              <div className="space-y-4">
                <div>
                  <h4
                    className="font-bold mb-2"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Reduce Waste & Expiration
                  </h4>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Tracking and automatic alerts, ensuring you never lose money
                    to expired stock.
                  </p>
                </div>
                <div>
                  <h4
                    className="font-bold mb-2"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Increase Staff Productivity
                  </h4>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Automated workflows free up your team's time for more
                    valuable customer interactions.
                  </p>
                </div>
                <div>
                  <h4
                    className="font-bold mb-2"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Optimize Pricing & Margins
                  </h4>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Understand your margins and pricing power to maximize
                    profitability across your store.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="w-48 h-48 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-light-gray)" }}
              >
                <div className="text-center">
                  <Zap
                    className="w-16 h-16 mx-auto mb-2"
                    style={{ color: "var(--color-primary-blue)" }}
                  />
                  <p
                    className="font-bold text-xl"
                    style={{ color: "var(--color-dark-blue)" }}
                  >
                    ANALYSCS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Efficiency Section */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-light-gray)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "var(--color-dark-blue)" }}
            >
              Designed for Efficiency and Patient Care
            </h2>
            <p className="text-lg" style={{ color: "var(--color-dark-text)" }}>
              Discover how our software can elevate your entire pharmacy
              organization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Streamlined Workflow",
                desc: "Go from busy chaos to an organized system. Organize all workflows in one place.",
              },
              {
                icon: Users,
                title: "Enhanced Patient Safety",
                desc: "Integrated alerts, clinical interactions, and alerts work together for better safety.",
              },
              {
                icon: BarChart3,
                title: "Cloud-Based Access",
                desc: "Use any device from any location to manage your pharmacy operations and insights.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl text-center"
                style={{
                  backgroundColor: "var(--color-white)",
                  borderColor: "var(--color-border-gray)",
                  border: "1px solid var(--color-border-gray)",
                }}
              >
                <item.icon
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "var(--color-primary-blue)" }}
                />
                <h3
                  className="font-bold mb-3 text-lg"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm opacity-75"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Stats */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--color-dark-blue)" }}
            >
              Real Results from Pharmacies Like Yours
            </h2>
            <p className="text-lg" style={{ color: "var(--color-dark-text)" }}>
              Join hundreds of pharmacies already transforming their operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "var(--color-light-gray)",
                borderColor: "var(--color-border-gray)",
                border: "1px solid var(--color-border-gray)",
              }}
            >
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "var(--color-dark-text)" }}
              >
                "PharmaSys has been a game-changer. We've cut our inventory
                management time by 75%, and reduced our stock expiration by 30%.
                The system is intuitive and our staff loves it!"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: "var(--color-primary-blue)" }}
                >
                  EK
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Emily Kowalski
                  </p>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Owner, Modern Pharmacy
                  </p>
                </div>
              </div>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{
                backgroundColor: "var(--color-light-gray)",
                borderColor: "var(--color-border-gray)",
                border: "1px solid var(--color-border-gray)",
              }}
            >
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "var(--color-dark-text)" }}
              >
                "The analytics have transformed our understanding of what's
                selling. The reports are so useful. Our team is so much more
                organized now and we've improved customer satisfaction across
                the board!"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: "var(--color-primary-blue)" }}
                >
                  JM
                </div>
                <div>
                  <p
                    className="font-bold"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    James Matthews
                  </p>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: "var(--color-dark-text)" }}
                  >
                    Manager, Community Pharmacy
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl"
            style={{
              backgroundColor: "var(--color-light-gray)",
              borderColor: "var(--color-border-gray)",
              border: "1px solid var(--color-border-gray)",
            }}
          >
            <div className="text-center">
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-primary-blue)" }}
              >
                50%
              </p>
              <p
                className="text-sm opacity-75"
                style={{ color: "var(--color-dark-text)" }}
              >
                Average time saved
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-primary-blue)" }}
              >
                28%
              </p>
              <p
                className="text-sm opacity-75"
                style={{ color: "var(--color-dark-text)" }}
              >
                Improved Efficiency
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-primary-blue)" }}
              >
                88%
              </p>
              <p
                className="text-sm opacity-75"
                style={{ color: "var(--color-dark-text)" }}
              >
                Customer Satisfaction
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--color-primary-blue)" }}
              >
                16%
              </p>
              <p
                className="text-sm opacity-75"
                style={{ color: "var(--color-dark-text)" }}
              >
                Revenue Growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 md:py-24 text-white"
        style={{ backgroundColor: "var(--color-primary-blue)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Pharmacy?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of pharmacies that have already transformed their
            workflows and increased their success. Get started today.
          </p>
          <button
            className="px-8 py-3 font-semibold rounded-lg transition text-white"
            style={{
              backgroundColor: "var(--color-white)",
              color: "var(--color-primary-blue)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-light-gray)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-white)")
            }
          >
            Request a Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTopColor: "var(--color-border-gray)",
          backgroundColor: "var(--color-white)",
          borderTop: "1px solid var(--color-border-gray)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-primary-blue)" }}
                >
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  PharmaSys
                </span>
              </div>
              <p
                className="text-sm opacity-75"
                style={{ color: "var(--color-dark-text)" }}
              >
                Making pharmacy management simple.
              </p>
            </div>

            <div>
              <h4
                className="font-bold mb-4 text-sm"
                style={{ color: "var(--color-dark-text)" }}
              >
                PRODUCT
              </h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-bold mb-4 text-sm"
                style={{ color: "var(--color-dark-text)" }}
              >
                COMPANY
              </h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-bold mb-4 text-sm"
                style={{ color: "var(--color-dark-text)" }}
              >
                LEGAL
              </h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="transition"
                    style={{ color: "var(--color-dark-text)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "var(--color-primary-blue)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-dark-text)")
                    }
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTopColor: "var(--color-border-gray)",
              borderTop: "1px solid var(--color-border-gray)",
              paddingTop: "2rem",
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p
                className="text-sm opacity-75 mb-4 md:mb-0"
                style={{ color: "var(--color-dark-text)" }}
              >
                © 2025 PharmaSys. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <select
                  className="text-sm rounded px-3 py-2"
                  style={{
                    borderColor: "var(--color-border-gray)",
                    color: "var(--color-dark-text)",
                    backgroundColor: "var(--color-white)",
                    border: "1px solid var(--color-border-gray)",
                  }}
                >
                  <option>ENGLISH (US)</option>
                </select>
                <button
                  className="px-4 py-2 text-white text-sm font-semibold rounded transition"
                  style={{ backgroundColor: "var(--color-primary-blue)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1a7bc2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--color-primary-blue)")
                  }
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
