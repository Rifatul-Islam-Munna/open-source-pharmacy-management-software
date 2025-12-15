"use client";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ShoppingCart } from "lucide-react";

const EmployeesSell = () => {
  const { data, isPending } = useQueryWrapper(
    ["get-my-employee-data"],
    "/sells/get-all-seller-data"
  );

  if (isPending) {
    return <LoadingSkeleton />;
  }

  const cards = data?.cards ?? [];
  const weeklyChart = data?.weeklyChart ?? [];
  const monthlyChart = data?.monthlyChart ?? [];
  const yearlyChart = data?.yearlyChart ?? [];

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--color-dark-text)" }}
        >
          Employee Sales Dashboard
        </h1>
        <p
          className="text-sm sm:text-base mt-1 sm:mt-2"
          style={{ color: "var(--color-dark-blue)" }}
        >
          Track and compare sales performance across your team
        </p>
      </div>

      {/* Today's Sales Cards */}
      <div>
        <h2
          className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4"
          style={{ color: "var(--color-dark-text)" }}
        >
          Today's Performance
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((seller) => (
            <Card
              key={seller?.sellerId ?? Math.random()}
              className="border shadow-none"
              style={{
                borderColor: "var(--color-border-gray)",
                backgroundColor: "var(--color-primary-background)",
              }}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle
                  className="text-sm font-medium"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {seller?.sellerName ?? "Unknown Seller"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Today's Sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--color-primary-blue)" }}
                >
                  ৳{seller?.todaySales?.toLocaleString() ?? 0}
                </div>
                <div
                  className="flex items-center gap-2 mt-3 sm:mt-4 text-xs"
                  style={{ color: "var(--color-dark-blue)" }}
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span>{seller?.todayTransactions ?? 0} orders</span>
                </div>
                <div className="mt-3 sm:mt-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-dark-blue)" }}>
                      Week:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--color-dark-text)" }}
                    >
                      ৳{seller?.weekSales?.toLocaleString() ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-dark-blue)" }}>
                      Month:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--color-dark-text)" }}
                    >
                      ৳{seller?.monthSales?.toLocaleString() ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-dark-blue)" }}>
                      Year:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--color-dark-text)" }}
                    >
                      ৳{seller?.yearSales?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Yearly Rankings - Moved up */}
      <Card
        className="border shadow-none"
        style={{
          borderColor: "var(--color-border-gray)",
          backgroundColor: "var(--color-primary-background)",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-lg sm:text-xl"
            style={{ color: "var(--color-dark-text)" }}
          >
            Year-to-Date Rankings
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Top performers for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {yearlyChart.map((seller, index) => (
              <div
                key={seller?.sellerId ?? index}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg border"
                style={{
                  borderColor: "var(--color-border-gray)",
                  backgroundColor: "var(--color-light-gray)",
                }}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full font-bold text-sm sm:text-base flex-shrink-0"
                    style={{
                      backgroundColor: "var(--color-primary-blue)",
                      color: "var(--color-white)",
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-medium text-sm sm:text-base truncate"
                      style={{ color: "var(--color-dark-text)" }}
                    >
                      {seller?.sellerName ?? "Unknown"}
                    </p>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--color-dark-blue)" }}
                    >
                      Total Sales
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-lg sm:text-2xl font-bold"
                    style={{ color: "var(--color-success)" }}
                  >
                    ৳{seller?.totalSales?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Seller Bar Charts */}
      <div>
        <h2
          className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4"
          style={{ color: "var(--color-dark-text)" }}
        >
          Individual Performance
        </h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {weeklyChart.map((seller) => (
            <Card
              key={seller?.sellerId ?? Math.random()}
              className="border shadow-none"
              style={{
                borderColor: "var(--color-border-gray)",
                backgroundColor: "var(--color-primary-background)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-base sm:text-lg"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  {seller?.sellerName ?? "Unknown"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Week, Month & Year Comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={seller?.data ?? []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border-gray)"
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: "var(--color-dark-text)", fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: "var(--color-dark-text)", fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `৳${Number(value ?? 0).toLocaleString()}`
                      }
                      contentStyle={{
                        backgroundColor: "var(--color-white)",
                        border: "1px solid var(--color-border-gray)",
                      }}
                    />
                    <Bar dataKey="amount" fill="var(--color-primary-blue)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Performance Line Chart */}
      <Card
        className="border shadow-none"
        style={{
          borderColor: "var(--color-border-gray)",
          backgroundColor: "var(--color-primary-background)",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-lg sm:text-xl"
            style={{ color: "var(--color-dark-text)" }}
          >
            Monthly Performance Comparison
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Compare all employees' sales across the year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={300}
            className="sm:h-[400px]"
          >
            <LineChart data={monthlyChart}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-gray)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--color-dark-text)", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "var(--color-dark-text)", fontSize: 11 }} />
              <Tooltip
                formatter={(value) => `৳${Number(value ?? 0).toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border-gray)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {cards.map((seller, index) => {
                const colors = [
                  "#2ca3fa",
                  "#10b981",
                  "#034c81",
                  "#f59e0b",
                  "#8b5cf6",
                  "#ef4444",
                ];
                return (
                  <Line
                    key={seller?.sellerId ?? index}
                    type="monotone"
                    dataKey={seller?.sellerName ?? "Unknown"}
                    stroke={colors[index % colors.length] ?? "#2ca3fa"}
                    strokeWidth={2}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8">
      <div>
        <Skeleton className="h-7 sm:h-8 w-48 sm:w-64 mb-1 sm:mb-2" />
        <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
      </div>

      <div>
        <Skeleton className="h-5 sm:h-6 w-36 sm:w-48 mb-3 sm:mb-4" />
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="border shadow-none"
              style={{ borderColor: "var(--color-border-gray)" }}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <Skeleton className="h-4 w-28 sm:w-32" />
                <Skeleton className="h-3 w-20 sm:w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 sm:h-8 w-20 sm:w-24 mb-3 sm:mb-4" />
                <Skeleton className="h-3 w-16 sm:w-20 mb-3 sm:mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card
        className="border shadow-none"
        style={{ borderColor: "var(--color-border-gray)" }}
      >
        <CardHeader>
          <Skeleton className="h-5 w-32 sm:w-48" />
          <Skeleton className="h-3 w-48 sm:w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 sm:h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-5 sm:h-6 w-36 sm:w-48 mb-3 sm:mb-4" />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="border shadow-none"
              style={{ borderColor: "var(--color-border-gray)" }}
            >
              <CardHeader>
                <Skeleton className="h-4 sm:h-5 w-28 sm:w-32" />
                <Skeleton className="h-3 w-36 sm:w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[250px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card
        className="border shadow-none"
        style={{ borderColor: "var(--color-border-gray)" }}
      >
        <CardHeader>
          <Skeleton className="h-5 w-40 sm:w-48" />
          <Skeleton className="h-3 w-48 sm:w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] sm:h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesSell;
