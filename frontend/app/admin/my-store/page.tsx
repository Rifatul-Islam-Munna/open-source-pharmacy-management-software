"use client";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import React from "react";

interface ShopTotals {
  totalUnits: number;
  totalSellingValue: number;
  totalPurchaseValue: number;
  totalBatches: number;
}

const MyStore = () => {
  const { data, isPending } = useQueryWrapper<ShopTotals>(
    ["get-my-store-details"],
    "/shop/get-my-shopDetails"
  );

  const profit = data ? data.totalSellingValue - data.totalPurchaseValue : 0;
  const profitMargin = data?.totalPurchaseValue
    ? ((profit / data.totalPurchaseValue) * 100).toFixed(2)
    : "0";
  console.log(profit);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Store Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Units Card */}
        <StatsCard
          title="Total Units"
          value={data?.totalUnits.toLocaleString()}
          loading={isPending}
          icon="📦"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />

        {/* Total Batches Card */}
        <StatsCard
          title="Total Batches"
          value={data?.totalBatches.toLocaleString()}
          loading={isPending}
          icon="🗂️"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatsCard
          title="Purchase Value"
          value={`৳${data?.totalPurchaseValue.toLocaleString()}`}
          subtitle={`Cost: ৳${data?.totalPurchaseValue.toLocaleString()}`}
          loading={isPending}
          icon="💰"
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />

        {/* Inventory Value Card */}
        <StatsCard
          title="Inventory Value"
          value={`৳${data?.totalSellingValue.toLocaleString()}`}
          subtitle={`Cost: ৳${data?.totalPurchaseValue.toLocaleString()}`}
          loading={isPending}
          icon="💰"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />

        {/* Profit Card */}
        <StatsCard
          title="Potential Profit"
          value={`৳${profit.toLocaleString()}`}
          subtitle={`${profitMargin}% margin`}
          loading={isPending}
          icon="📈"
          bgColor={profit >= 0 ? "bg-emerald-50" : "bg-red-50"}
          textColor={profit >= 0 ? "text-emerald-600" : "text-red-600"}
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value?: string;
  subtitle?: string;
  loading: boolean;
  icon: string;
  bgColor: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  loading,
  icon,
  bgColor,
  textColor,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`${bgColor} p-2 rounded-full`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <div className={`text-3xl font-bold ${textColor} mb-1`}>
        {value || "0"}
      </div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default MyStore;
