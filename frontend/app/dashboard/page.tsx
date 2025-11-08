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

// All periods demo data—expand as you need
const dataMap = {
  today: [
    { time: "9 AM", revenue: 120, cost: 75, profit: 45 },
    { time: "10 AM", revenue: 180, cost: 110, profit: 70 },
    { time: "11 AM", revenue: 240, cost: 145, profit: 95 },
    { time: "12 PM", revenue: 310, cost: 190, profit: 120 },
    { time: "1 PM", revenue: 420, cost: 250, profit: 170 },
    { time: "2 PM", revenue: 580, cost: 340, profit: 240 },
    { time: "3 PM", revenue: 720, cost: 425, profit: 295 },
    { time: "4 PM", revenue: 890, cost: 520, profit: 370 },
  ],
  week: [
    { day: "Mon", revenue: 3200, cost: 1920, profit: 1280 },
    { day: "Tue", revenue: 3800, cost: 2280, profit: 1520 },
    { day: "Wed", revenue: 3400, cost: 2040, profit: 1360 },
    { day: "Thu", revenue: 4500, cost: 2700, profit: 1800 },
    { day: "Fri", revenue: 5200, cost: 3120, profit: 2080 },
    { day: "Sat", revenue: 6100, cost: 3660, profit: 2440 },
    { day: "Sun", revenue: 4200, cost: 2520, profit: 1680 },
  ],
  month: [
    { week: "Week 1", revenue: 18400, cost: 11040, profit: 7360 },
    { week: "Week 2", revenue: 21200, cost: 12720, profit: 8480 },
    { week: "Week 3", revenue: 19800, cost: 11880, profit: 7920 },
    { week: "Week 4", revenue: 22900, cost: 13740, profit: 9160 },
  ],
  year: [
    { month: "Jan", revenue: 65400, cost: 39240, profit: 26160 },
    { month: "Feb", revenue: 72300, cost: 43380, profit: 28920 },
    { month: "Mar", revenue: 78700, cost: 47220, profit: 31480 },
    { month: "Apr", revenue: 69200, cost: 41520, profit: 27680 },
    { month: "May", revenue: 81500, cost: 48900, profit: 32600 },
    { month: "Jun", revenue: 76800, cost: 46080, profit: 30720 },
    { month: "Jul", revenue: 84400, cost: 50640, profit: 33760 },
    { month: "Aug", revenue: 79900, cost: 47940, profit: 31960 },
    { month: "Sep", revenue: 87100, cost: 52260, profit: 34840 },
    { month: "Oct", revenue: 82300, cost: 49380, profit: 32920 },
    { month: "Nov", revenue: 90600, cost: 54360, profit: 36240 },
    { month: "Dec", revenue: 95400, cost: 57240, profit: 38160 },
  ],
};

const topProductsData = {
  today: [
    { name: "Paracetamol 500mg", units: 45, revenue: 324 },
    { name: "Cetirizine 10mg", units: 38, revenue: 209 },
    { name: "Aspirin 81mg", units: 32, revenue: 584 },
    { name: "Metformin 500mg", units: 28, revenue: 119 },
    { name: "Ibuprofen 200mg", units: 24, revenue: 288 },
  ],
  week: [
    { name: "Paracetamol 500mg", units: 312, revenue: 2246 },
    { name: "Amoxicillin 250mg", units: 267, revenue: 1736 },
    { name: "Ibuprofen 200mg", units: 245, revenue: 2940 },
    { name: "Cetirizine 10mg", units: 198, revenue: 1089 },
    { name: "Omeprazole 20mg", units: 176, revenue: 1716 },
  ],
  month: [
    { name: "Paracetamol 500mg", units: 1240, revenue: 8928 },
    { name: "Amoxicillin 250mg", units: 980, revenue: 6370 },
    { name: "Ibuprofen 200mg", units: 856, revenue: 10272 },
    { name: "Cetirizine 10mg", units: 742, revenue: 4081 },
    { name: "Omeprazole 20mg", units: 623, revenue: 6074 },
  ],
  year: [
    { name: "Paracetamol 500mg", units: 15680, revenue: 112896 },
    { name: "Amoxicillin 250mg", units: 12740, revenue: 82810 },
    { name: "Ibuprofen 200mg", units: 10912, revenue: 130944 },
    { name: "Cetirizine 10mg", units: 9646, revenue: 53053 },
    { name: "Omeprazole 20mg", units: 8099, revenue: 78965 },
  ],
};

export default function EnhancedDashboard() {
  const [timeRange, setTimeRange] = useState<
    "today" | "week" | "month" | "year"
  >("month");
  const currentData = dataMap[timeRange];
  const currentTopProducts = topProductsData[timeRange];
  const totalRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCost = currentData.reduce((sum, d) => sum + d.cost, 0);
  const totalProfit = currentData.reduce((sum, d) => sum + d.profit, 0);
  const profitMargin = ((totalProfit / (totalRevenue || 1)) * 100).toFixed(1);
  const salesCount = { today: 87, week: 542, month: 2156, year: 8947 }[
    timeRange
  ];
  const customerCount = { today: 64, week: 412, month: 1523, year: 6234 }[
    timeRange
  ];
  const revenueGrowth = 12.5;
  const profitGrowth = 15.8;
  const isProfit = totalProfit > 0;

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
              onClick={() => setTimeRange(period as any)}
              className={`px-4 py-1.5 text-xs rounded transition-colors ${
                timeRange === period
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
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-primary-blue" />}
          label="Revenue Growth"
          changeLabel={`+${revenueGrowth}%`}
          changeIcon={<TrendingUp className="h-3 w-3 text-success" />}
          iconBg="bg-primary-blue/10"
        />
        <DashboardStat
          title="Total Cost"
          value={`$${totalCost.toLocaleString()}`}
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
          value={`$${Math.abs(totalProfit).toLocaleString()}`}
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
              Revenue vs Cost vs Profit - {capitalize(timeRange)}
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
                  dataKey={
                    timeRange === "today"
                      ? "time"
                      : timeRange === "week"
                      ? "day"
                      : timeRange === "month"
                      ? "week"
                      : "month"
                  }
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
                  dataKey={
                    timeRange === "today"
                      ? "time"
                      : timeRange === "week"
                      ? "day"
                      : timeRange === "month"
                      ? "week"
                      : "month"
                  }
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
                  stroke="#10B981"
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
              Top Products - {capitalize(timeRange)}
            </CardTitle>
            <p className="text-xs text-dark-text/60">Units sold and revenue</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={currentTopProducts}
                layout="vertical"
                margin={{ left: 100, right: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  label={{
                    value: "Revenue ($)",
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
                            Revenue: ${payload[0].payload.revenue}
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
                    formatter={(value) => `${value} units`}
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
              {currentTopProducts.map((product, index) => (
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
                    ${product.revenue}
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
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Total Expenses</span>
              <span className="text-sm font-bold text-yellow-600">
                ${totalCost.toLocaleString()}
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
                ${Math.abs(totalProfit).toLocaleString()}
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
                ${(totalRevenue / (salesCount || 1)).toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between p-2 border border-border-gray rounded-lg">
              <span className="text-sm text-dark-text">Low Stock Items</span>
              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                8
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Growth vs Previous */}
        <Card className="border-border-gray shadow-none">
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
        </Card>
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
              <span className="text-xs text-success font-medium">
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
