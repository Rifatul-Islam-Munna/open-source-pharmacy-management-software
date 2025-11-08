"use client";

import { useState, ViewTransition } from "react";
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

// Demo data
const demoAlerts = [
  {
    id: "1",
    name: "Aspirin 81mg",
    batchName: "BATCH2024-001",
    type: "expiring",
    expiryDate: new Date("2024-12-24"),
    currentStock: null,
    threshold: null,
    daysUntilExpiry: 7,
  },
  {
    id: "2",
    name: "Amoxicillin 500mg",
    batchName: "BATCH2024-045",
    type: "low-stock",
    expiryDate: null,
    currentStock: 12,
    threshold: 15,
    daysUntilExpiry: null,
  },
  {
    id: "3",
    name: "Ibuprofen 200mg",
    batchName: "BATCH2024-032",
    type: "expiring",
    expiryDate: new Date("2024-12-24"),
    currentStock: null,
    threshold: null,
    daysUntilExpiry: 7,
  },
  {
    id: "4",
    name: "Metformin 1000mg",
    batchName: "BATCH2024-078",
    type: "low-stock",
    expiryDate: null,
    currentStock: 10,
    threshold: 10,
    daysUntilExpiry: null,
  },
  {
    id: "5",
    name: "Cetirizine 10mg",
    batchName: "BATCH2024-019",
    type: "expiring",
    expiryDate: new Date("2024-12-28"),
    currentStock: null,
    threshold: null,
    daysUntilExpiry: 11,
  },
  {
    id: "6",
    name: "Paracetamol 500mg",
    batchName: "BATCH2024-056",
    type: "low-stock",
    expiryDate: null,
    currentStock: 8,
    threshold: 12,
    daysUntilExpiry: null,
  },
  {
    id: "7",
    name: "Omeprazole 20mg",
    batchName: "BATCH2024-063",
    type: "expiring",
    expiryDate: new Date("2025-01-05"),
    currentStock: null,
    threshold: null,
    daysUntilExpiry: 20,
  },
  {
    id: "8",
    name: "Aspirin 800mg",
    batchName: "BATCH2024-091",
    type: "low-stock",
    expiryDate: null,
    currentStock: 5,
    threshold: 12,
    daysUntilExpiry: null,
  },
];

export default function AlertsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("urgency");
  const [filterType, setFilterType] = useState("all");

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Filter alerts
  let filteredAlerts = demoAlerts.filter((alert) => {
    const matchesSearch =
      alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || alert.type === filterType;
    return matchesSearch && matchesType;
  });

  // Sort alerts
  filteredAlerts.sort((a, b) => {
    switch (sortBy) {
      case "urgency":
        return (a.daysUntilExpiry || 999) - (b.daysUntilExpiry || 999);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "stock-asc":
        return (a.currentStock || 999) - (b.currentStock || 999);
      case "stock-desc":
        return (b.currentStock || 999) - (a.currentStock || 999);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Alerts</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Monitor items needing restock or nearing their expiration date.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-light-gray p-0.5 rounded-lg border border-border-gray">
            <Button
              variant={filterType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType("all")}
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
              onClick={() => setFilterType("low-stock")}
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
              onClick={() => setFilterType("expiring")}
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
                <RadioGroup value={sortBy} onValueChange={setSortBy}>
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
      </div>

      {/* Alert Cards Grid - 4 columns */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {paginatedAlerts.length > 0 ? (
            paginatedAlerts.map((alert) => (
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
                      <p className="text-[10px] text-dark-text/60 pl-[18px]">
                        {formatDate(alert.expiryDate!)}
                      </p>
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
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length}{" "}
          alerts
        </p>
      </div>
    </div>
  );
}
