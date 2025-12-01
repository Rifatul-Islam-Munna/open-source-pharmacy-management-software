"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertCircle,
  Percent,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useApiMutation,
  useQueryWrapper,
} from "@/api-hooks/react-query-wrapper";
import { DashboardResponse, Period } from "@/@types/dashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { format, toZonedTime } from "date-fns-tz";
import {
  addWeeks,
  format as formatDate,
  differenceInDays,
  startOfMonth,
} from "date-fns";
// Helper to format period for chart labels
const formatPeriodLabel = (period: Period, range: string): string => {
  const timeZone = "Asia/Dhaka";
  if (typeof period === "number") {
    if (range === "today") {
      const utcDate = new Date();
      utcDate.setUTCHours(period, 0, 0, 0);
      const bdtDate = toZonedTime(utcDate, timeZone);
      return format(bdtDate, "h a");
    }

    if (range === "week") {
      // 1 → Monday, 2 → Tuesday, etc.
      const days = [
        "",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      return days[period] || `Day ${period}`;
    }

    if (range === "month") {
      const now = new Date();
      const monthStart = startOfMonth(now); // First day of the month
      const dayOfMonth = differenceInDays(now, monthStart) + 1; // Day number in month

      // Calculate week in month (1-5)
      const weekOfMonth = Math.ceil(dayOfMonth / 7);

      const weekText =
        weekOfMonth === 1
          ? "First"
          : weekOfMonth === 2
          ? "Second"
          : weekOfMonth === 3
          ? "Third"
          : "Last"; // 4th or 5th week

      // Get month name
      const monthName = now.toLocaleString("default", { month: "long" });

      return `${weekText} week of ${monthName}`;
    }

    if (range === "year") {
      // 1 → January, 2 → February, ..., 12 → December
      const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months[period] || `Month ${period}`;
    }
  }

  // Custom date object
  return `${period.day}/${period.month}/${period.year}`;
};

// Helper to get period type for range selection
const getPeriodType = (period: Period): "today" | "week" | "month" | "year" => {
  if (typeof period === "number") {
    if (period <= 23) return "today"; // 0-23 hours
    if (period <= 7) return "week"; // 1-7 days
    if (period <= 52) return "month"; // 1-52 weeks
    return "year"; // 1-12+ months
  }
  return "month"; // default for custom dates
};

// Format number to BDT currency
const formatBDT = (value: number): string => {
  return `৳ ${value.toFixed(2)}`;
};

// Helper to capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const TimeBaseValue = {
  today: 7200,
  week: 86400,
  month: 259200,
  year: 1296000,
};

export default function EnhancedDashboard() {
  const [selectedRange, setSelectedRange] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const numberOfTime = TimeBaseValue[selectedRange];

  const { data: dashboardData, isPending } = useQueryWrapper<DashboardResponse>(
    ["dashboard", selectedRange],
    `/sells/get-all-dashboardData?range=${selectedRange}`,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    numberOfTime
  );

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-dark-text">No data available</div>
    );
  }

  const { summary, chartData, topProducts } = dashboardData;

  // Transform chart data with proper labels
  const currentData = chartData.map((item) => ({
    ...item,
    label: formatPeriodLabel(item.period, selectedRange),
  }));

  const totalRevenue = summary.totalRevenue;
  const totalCost = summary.totalCost;
  const totalProfit = summary.totalProfit;
  const profitMargin = summary.profitMargin;
  const salesCount = summary.totalSales;
  const customerCount = summary.customerCount;
  const totalDue = summary.totalDue;

  const isProfit = totalProfit > 0;
  const revenueGrowth = 12.5; // Keep hardcoded or fetch from API if available
  const profitGrowth = 15.8; // Keep hardcoded or fetch from API if available

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Dashboard</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Financial analytics and performance overview
        </p>
      </div>

      {/* Time Range Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-light-gray p-0.5 rounded-lg border border-border-gray w-fit">
          {["today", "week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedRange(period as any)}
              className={`px-4 py-1.5 text-xs rounded transition-colors ${
                selectedRange === period
                  ? "bg-primary-blue text-white"
                  : "text-dark-text hover:bg-white"
              }`}
            >
              {period === "today" ? "Today" : `This ${capitalize(period)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardStat
          title="Revenue"
          value={formatBDT(totalRevenue)}
          icon={<DollarSign className="h-6 w-6 text-primary-blue" />}
          label="Revenue Growth"
          changeLabel={`+${revenueGrowth}%`}
          changeIcon={<TrendingUp className="h-3 w-3 text-success" />}
          iconBg="bg-primary-blue/10"
        />
        <DashboardStat
          title="Total Cost"
          value={formatBDT(totalCost)}
          icon={<Package className="h-6 w-6 text-yellow-600" />}
          label="Cost / Revenue"
          changeLabel={`${((totalCost / (totalRevenue || 1)) * 100).toFixed(
            1
          )}%`}
          changeIcon={<Package className="h-3 w-3 text-dark-text/50" />}
          iconBg="bg-yellow-500/10"
        />
        <DashboardStat
          title={isProfit ? "Net Profit" : "Net Loss"}
          value={formatBDT(Math.abs(totalProfit))}
          icon={
            isProfit ? (
              <TrendingUp className="h-6 w-6 text-success" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600" />
            )
          }
          label="Profit Growth"
          changeLabel={`${isProfit ? "+" : ""}${profitGrowth}%`}
          changeIcon={
            isProfit ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )
          }
          iconBg={isProfit ? "bg-success/10" : "bg-red-500/10"}
          highlight={isProfit ? "border-success" : "border-red-500"}
        />
        <DashboardStat
          title="Profit Margin"
          value={`${profitMargin}%`}
          icon={<Percent className="h-6 w-6 text-primary-blue" />}
          label="Sales"
          changeLabel={`${salesCount}`}
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Profit/Loss Banner */}
      <div className="px-4">
        <Card
          className={`border-2 shadow-none ${
            isProfit
              ? "bg-success/5 border-success"
              : "bg-red-50 border-red-500"
          }`}
        >
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {isProfit ? (
                  <div className="rounded-full bg-success h-10 w-10 flex items-center justify-center">
                    <TrendingUp className="text-white h-5 w-5" />
                  </div>
                ) : (
                  <div className="rounded-full bg-red-600 h-10 w-10 flex items-center justify-center">
                    <AlertCircle className="text-white h-5 w-5" />
                  </div>
                )}
                <div>
                  <p
                    className={`font-bold text-sm ${
                      isProfit ? "text-success" : "text-red-600"
                    }`}
                  >
                    {isProfit ? "✓ You are in PROFIT" : "⚠ You are in LOSS"}
                  </p>
                  <p className="text-xs text-dark-text mt-0.5">
                    {isProfit
                      ? `Excellent! Your profit margin is ${profitMargin}%. Keep it up!`
                      : `Warning! Your costs exceed revenue. Review expenses urgently!`}
                  </p>
                </div>
              </div>
              <Badge
                className={`${
                  isProfit
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-red-500/10 text-red-600 border-red-500/20"
                }`}
              >
                {isProfit ? "Profitable" : "Needs Attention"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="px-4 grid grid-cols-1 xl:grid-cols-2 gap-3">
        {/* Main area/line charts */}
        <Card className="border-border-gray shadow-none xl:col-span-2">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-base text-dark-blue">
              Revenue vs Cost vs Profit - {capitalize(selectedRange)}
            </CardTitle>
            <Badge
              className={`${
                isProfit
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-red-500/10 text-red-600 border-red-500/20"
              }`}
            >
              Margin: {profitMargin}%
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stackId="2"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                  name="Cost"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="3"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.8}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit Trend Line */}
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-dark-blue">
              Profit Trend
            </CardTitle>
            <p className="text-xs text-dark-text/60">
              Monitor profit fluctuations
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B82F"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products With Labels */}
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-dark-blue">
              Top Products - {capitalize(selectedRange)}
            </CardTitle>
            <p className="text-xs text-dark-text/60">Units sold and revenue</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ left: 100, right: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  label={{
                    value: "Revenue (BDT)",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: 6,
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border border-border-gray rounded shadow-sm">
                          <p className="text-xs font-semibold text-dark-blue">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-xs text-dark-text mt-1">
                            <span className="font-medium">Units:</span>{" "}
                            {payload[0].payload.units}
                          </p>
                          <p className="text-xs text-success font-semibold">
                            Revenue: {formatBDT(payload[0].payload.revenue)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[0, 8, 8, 0]}>
                  <LabelList
                    dataKey="units"
                    position="right"
                    formatter={(value: number) => `${value} units`}
                    style={{ fill: "#374151", fontWeight: 600, fontSize: 12 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t border-border-gray">
              <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-dark-text/60 mb-2 px-1">
                <div>Medicine</div>
                <div className="text-center">Units Sold</div>
                <div className="text-right">Revenue</div>
              </div>
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-1 text-xs py-1.5 px-1 hover:bg-light-gray rounded transition-colors"
                >
                  <div className="text-dark-blue font-medium truncate">
                    {product.name}
                  </div>
                  <div className="text-center">
                    <Badge className="bg-primary-blue/10 text-primary-blue border-primary-blue/20 text-[10px]">
                      {product.units}
                    </Badge>
                  </div>
                  <div className="text-right font-semibold text-success">
                    {formatBDT(product.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive 3-cols Financial Summary & Metrics */}
      <div className="px-4 grid grid-cols-1 xl:grid-cols-3 gap-3">
        {/* Financial Summary */}
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-dark-blue">
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Gross Revenue</span>
              <span className="text-sm font-bold text-primary-blue">
                {formatBDT(totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Total Expenses</span>
              <span className="text-sm font-bold text-yellow-600">
                {formatBDT(totalCost)}
              </span>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">
                Net {isProfit ? "Profit" : "Loss"}
              </span>
              <span
                className={`text-sm font-bold ${
                  isProfit ? "text-success" : "text-red-600"
                }`}
              >
                {formatBDT(Math.abs(totalProfit))}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-light-gray rounded-lg">
              <span className="text-sm font-semibold text-dark-blue">
                Profit Margin
              </span>
              <span className="text-sm font-bold text-primary-blue">
                {profitMargin}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-dark-blue">
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Total Sales</span>
              <Badge className="bg-primary-blue/10 text-primary-blue border-primary-blue/20">
                {salesCount}
              </Badge>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Customers</span>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                {customerCount}
              </Badge>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Avg Sale Value</span>
              <Badge className="bg-success/10 text-success border-success/20">
                {formatBDT(totalRevenue / (salesCount || 1))}
              </Badge>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Total Due</span>
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                {formatBDT(totalDue)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Growth vs Previous */}
        {/*  <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-dark-blue">
              Growth vs Previous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div>
                <p className="text-xs text-dark-text/60">Revenue Growth</p>
                <p className="text-lg font-bold text-success">
                  +{revenueGrowth}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div>
                <p className="text-xs text-dark-text/60">Profit Growth</p>
                <p className="text-lg font-bold text-success">
                  +{profitGrowth}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

function DashboardStat({
  title,
  value,
  icon,
  label,
  changeLabel,
  changeIcon,
  iconBg,
  highlight,
}: any) {
  return (
    <Card
      className={`border-border-gray shadow-none ${highlight ? highlight : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-dark-text/60 uppercase">{title}</p>
            <p className="text-2xl font-bold text-dark-blue mt-1">{value}</p>
            <div className="flex gap-1 items-center mt-1">
              {changeIcon}
              <span className="text-xs hidden text-success font-medium">
                {changeLabel}
              </span>
              <span className="text-xs text-dark-text/60">{label}</span>
            </div>
          </div>
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              iconBg || "bg-light-gray"
            }`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Component (unchanged)
function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 bg-light-gray p-0.5 rounded-lg border border-border-gray w-fit">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded" />
            ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="border-border-gray shadow-none">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Banner */}
      <div className="px-4">
        <Card className="border-border-gray shadow-none">
          <CardContent className="p-4">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="px-4 grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Card className="border-border-gray shadow-none xl:col-span-2">
          <CardHeader className="pb-3 space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3 space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
        <Card className="border-border-gray shadow-none">
          <CardHeader className="pb-3 space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-72 w-full" />
              <div className="pt-3 border-t border-border-gray space-y-2">
                <div className="grid grid-cols-3 gap-1 h-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="w-full" />
                    ))}
                </div>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="grid grid-cols-3 gap-1 h-6">
                      {Array(3)
                        .fill(0)
                        .map((_, j) => (
                          <Skeleton key={j} className="w-full h-full" />
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="px-4 grid grid-cols-1 xl:grid-cols-3 gap-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
