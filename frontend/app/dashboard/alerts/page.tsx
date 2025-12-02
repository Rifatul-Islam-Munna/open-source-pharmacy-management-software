"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUpDown,
  Eye,
  ShoppingCart,
  Clock,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { AlertItem, AlertsResponse } from "@/@types/alerts";

export default function AlertsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "urgency" | "name-asc" | "name-desc" | "stock-asc" | "stock-desc"
  >("urgency");
  const [filterType, setFilterType] = useState<
    "all" | "low-stock" | "expiring"
  >("all");

  // New thresholds
  const [expiryDaysThreshold, setExpiryDaysThreshold] = useState(90);
  const [lowStockThreshold, setLowStockThreshold] = useState(15);

  const params = new URLSearchParams();
  params.set("page", currentPage.toString());
  params.set("itemsPerPage", itemsPerPage.toString());
  params.set("sortBy", sortBy);
  params.set("filterType", filterType);
  params.set("expiryDaysThreshold", expiryDaysThreshold.toString());
  params.set("lowStockThreshold", lowStockThreshold.toString());
  if (searchQuery.trim()) params.set("searchQuery", searchQuery.trim());

  const { data, isPending } = useQueryWrapper<AlertsResponse>(
    [
      "get-my-alerts",
      currentPage,
      itemsPerPage,
      sortBy,
      filterType,
      searchQuery,
      expiryDaysThreshold,
      lowStockThreshold,
    ],
    `/shop/get-my-alerts?${params.toString()}`
  );

  const alerts: AlertItem[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, "...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...", totalPages);
    }

    return pages;
  };

  const skeletonCards = Array.from({ length: itemsPerPage });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Alerts</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Monitor items needing restock or nearing their expiration date.
        </p>
      </div>

      {/* Search, Filters, Thresholds */}
      <div className="px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-light-gray p-0.5 rounded-lg border border-border-gray">
            <Button
              variant={filterType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setFilterType("all");
                setCurrentPage(1);
              }}
              className={`h-8 text-xs px-3 ${
                filterType === "all"
                  ? "bg-primary-blue text-white hover:bg-primary-blue"
                  : "hover:bg-white text-dark-text"
              }`}
            >
              All Alerts
            </Button>
            <Button
              variant={filterType === "low-stock" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setFilterType("low-stock");
                setCurrentPage(1);
              }}
              className={`h-8 text-xs px-3 ${
                filterType === "low-stock"
                  ? "bg-primary-blue text-white hover:bg-primary-blue"
                  : "hover:bg-white text-dark-text"
              }`}
            >
              Low Stock
            </Button>
            <Button
              variant={filterType === "expiring" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setFilterType("expiring");
                setCurrentPage(1);
              }}
              className={`h-8 text-xs px-3 ${
                filterType === "expiring"
                  ? "bg-primary-blue text-white hover:bg-primary-blue"
                  : "hover:bg-white text-dark-text"
              }`}
            >
              Expiring Soon
            </Button>
          </div>

          {/* Sort Popover */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border-gray hover:bg-light-gray shadow-none text-sm"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by: {sortBy === "urgency" ? "Urgency" : "Name"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 shadow-none border-border-gray"
              align="end"
            >
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-dark-blue">
                  Sort By
                </h4>
                <RadioGroup
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value as typeof sortBy);
                    setCurrentPage(1);
                  }}
                >
                  <div className="space-y-2">
                    {[
                      { value: "urgency", label: "Urgency" },
                      { value: "name-asc", label: "Name (A-Z)" },
                      { value: "name-desc", label: "Name (Z-A)" },
                      { value: "stock-asc", label: "Stock (Low to High)" },
                      { value: "stock-desc", label: "Stock (High to Low)" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="border-border-gray text-primary-blue"
                        />
                        <Label
                          htmlFor={option.value}
                          className="text-sm text-dark-text cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <Button
                  size="sm"
                  onClick={() => setSortOpen(false)}
                  className="w-full h-8 bg-primary-blue hover:bg-dark-blue text-white shadow-none text-xs"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Threshold controls */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-text">Expiring within</span>
            <Input
              type="number"
              min={1}
              className="h-8 w-20 text-xs border-border-gray shadow-none"
              value={expiryDaysThreshold}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setExpiryDaysThreshold(val);
                setCurrentPage(1);
              }}
            />
            <span className="text-xs text-dark-text">days</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-text">Low stock below</span>
            <Input
              type="number"
              min={1}
              className="h-8 w-20 text-xs border-border-gray shadow-none"
              value={lowStockThreshold}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setLowStockThreshold(val);
                setCurrentPage(1);
              }}
            />
            <span className="text-xs text-dark-text">units</span>
          </div>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {isPending ? (
            skeletonCards.map((_, idx) => (
              <Card
                key={`skeleton-${idx}`}
                className="shadow-none border-border-gray overflow-hidden"
              >
                <div className="h-0.5 bg-gray-200" />
                <CardContent className="p-2.5 space-y-2 animate-pulse">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2 w-20 bg-gray-200 rounded" />
                    </div>
                    <div className="h-4 w-10 bg-gray-200 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-2 w-20 bg-gray-200 rounded ml-4" />
                  </div>
                  <div className="flex gap-1.5 pt-0.5">
                    <div className="flex-1 h-7 bg-gray-200 rounded" />
                    <div className="h-7 w-7 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <Card
                key={alert.id}
                className="shadow-none border-border-gray hover:border-primary-blue transition-colors overflow-hidden"
              >
                <div
                  className={`h-0.5 ${
                    alert.type === "expiring" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                />
                <CardContent className="p-2.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-dark-blue truncate leading-tight">
                        {alert.name}
                      </h3>
                      <p className="text-[10px] text-dark-text/60 mt-0.5">
                        {alert.batchName}
                      </p>
                    </div>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 h-4 leading-none flex-shrink-0 ${
                        alert.type === "expiring"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {alert.type === "expiring" ? "Expiring" : "Low"}
                    </Badge>
                  </div>

                  {alert.type === "expiring" ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-red-600">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          {alert.daysUntilExpiry} days left
                        </span>
                      </div>
                      {alert.expiryDate && (
                        <p className="text-[10px] text-dark-text/60 pl-[18px]">
                          {formatDate(alert.expiryDate)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-yellow-700">
                        <Package className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          Stock: {alert.currentStock}/{alert.threshold}
                        </span>
                      </div>
                      <p className="text-[10px] text-dark-text/60 pl-[18px]">
                        Below threshold
                      </p>
                    </div>
                  )}

                  <div className="flex gap-1.5 pt-0.5">
                    <Button
                      size="sm"
                      className="flex-1 h-7 bg-success hover:bg-success/90 text-white shadow-none text-[11px] px-2"
                      onClick={() => router.push("/sell-medicine")}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Order
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 border-border-gray hover:bg-light-gray shadow-none"
                      onClick={() => router.push(`/inventory/view/${alert.id}`)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-dark-text">
              No alerts found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-dark-text">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-20 border-border-gray shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="shadow-none border-border-gray">
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-dark-text">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 border-border-gray hover:bg-light-gray shadow-none disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-dark-text text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page as number)}
                    className={`h-9 w-9 p-0 shadow-none rounded-full ${
                      currentPage === page
                        ? "bg-primary-blue text-white hover:bg-dark-blue"
                        : "border-border-gray hover:bg-light-gray text-dark-text"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-9 border-border-gray hover:bg-light-gray shadow-none disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-dark-text mt-3">
          Showing {data?.data?.length} to{" "}
          {Math.min(currentPage * itemsPerPage + itemsPerPage, total)} of{" "}
          {totalPages} alerts
        </p>
      </div>
    </div>
  );
}
