"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Search, Filter, ArrowUpDown, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { Sale, SalesResponse } from "@/@types/sells";
import { useDebounce } from "use-debounce";
import { SalesModal } from "@/components/custom/sales/SalesModal";

export default function SalesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [text] = useDebounce(searchQuery, 1000);

  const query = new URLSearchParams();
  query.set("currentPage", currentPage.toString());
  query.set("itemsPerPage", itemsPerPage.toString());
  query.set("sortBy", sortBy);
  if (selectedStatus?.length > 0)
    selectedStatus?.forEach((item) => query.append("status", item));
  if (text.length > 3) query.append("searchQuery", text);

  const { data, isPending } = useQueryWrapper<SalesResponse>(
    ["get-sales", currentPage, itemsPerPage, selectedStatus, sortBy, text],
    `/sells/get-my-sales?${query.toString()}`
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 text-xs">
          Paid
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20 text-xs">
        Due
      </Badge>
    );
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const totalPages = data?.pagination?.totalPages || 1;
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

  // Skeleton Row Component
  const SkeletonRow = () => (
    <TableRow className="hover:bg-light-gray">
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-12 rounded" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );

  const sales = data?.sales || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.itemsPerPage
    : 0;
  const endIndex = pagination
    ? Math.min(startIndex + pagination.itemsPerPage, pagination.totalCount)
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Sales History</h1>
        <p className="text-sm text-dark-text mt-0.5">
          View all sales transactions and invoices
        </p>
      </div>
      <SalesModal
        sale={selectedSale}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSale(null);
        }}
      />

      {/* Search and Actions */}
      <div className="px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
            <Input
              placeholder="Search by invoice, customer, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-border-gray focus:border-primary-blue shadow-none"
            />
          </div>

          {/* Filter Popover */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-border-gray hover:bg-light-gray shadow-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {selectedStatus.length > 0 && (
                  <Badge className="ml-2 bg-primary-blue text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {selectedStatus.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 shadow-none border-border-gray"
              align="start"
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-dark-blue mb-3">
                    Payment Status
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "paid", label: "Paid" },
                      { value: "due", label: "Due" },
                    ].map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={status.value}
                          checked={selectedStatus.includes(status.value)}
                          onCheckedChange={() => toggleStatus(status.value)}
                          className="border-border-gray data-[state=checked]:bg-primary-blue"
                        />
                        <label
                          htmlFor={status.value}
                          className="text-sm text-dark-text cursor-pointer"
                        >
                          {status.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-border-gray">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedStatus([]);
                      setFilterOpen(false);
                    }}
                    className="flex-1 h-8 border-border-gray hover:bg-light-gray shadow-none text-xs"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 h-8 bg-primary-blue hover:bg-dark-blue text-white shadow-none text-xs"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Popover */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-border-gray hover:bg-light-gray shadow-none"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56 shadow-none border-border-gray"
              align="start"
            >
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-dark-blue">
                  Sort By
                </h4>
                <RadioGroup value={sortBy} onValueChange={setSortBy}>
                  <div className="space-y-2">
                    {[
                      { value: "date-desc", label: "Date (Newest)" },
                      { value: "date-asc", label: "Date (Oldest)" },
                      { value: "price-desc", label: "Price (High to Low)" },
                      { value: "price-asc", label: "Price (Low to High)" },
                      { value: "invoice-asc", label: "Invoice (A-Z)" },
                      { value: "invoice-desc", label: "Invoice (Z-A)" },
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

      {/* Table */}
      <div className="px-4">
        <div className="border border-border-gray rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-light-gray hover:bg-light-gray">
                <TableHead className="font-semibold text-dark-text">
                  INVOICE ID
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  CUSTOMER
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  PHONE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  MEDICINES
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  TOTAL PRICE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  STATUS
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  DATE
                </TableHead>
                <TableHead className="font-semibold text-dark-text text-right">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                // Show skeleton rows during loading
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <TableRow
                    key={sale._id}
                    className="hover:bg-light-gray transition-colors"
                  >
                    <TableCell className="font-medium text-dark-blue">
                      {sale.invoiceId}
                    </TableCell>
                    <TableCell className="text-dark-text text-sm">
                      {sale.customerName || (
                        <span className="text-dark-text/40 italic">
                          Walk-in
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-dark-text text-sm">
                      {sale.customerPhone || (
                        <span className="text-dark-text/40">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-dark-text text-sm max-w-xs">
                      <div className="flex items-center gap-1">
                        {sale.items.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-light-gray px-2 py-0.5 rounded text-xs"
                          >
                            {item.medicineName}
                          </span>
                        ))}
                        {sale.items.length > 2 && (
                          <span className="text-xs text-dark-text/60">
                            +{sale.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-dark-text font-semibold">
                      ${sale.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
                    <TableCell className="text-dark-text text-sm">
                      {formatDate(sale.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-light-gray"
                          >
                            <MoreHorizontal className="h-4 w-4 text-dark-text" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 shadow-none border-border-gray"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSale(sale);
                              setModalOpen(true);
                            }}
                            className="cursor-pointer hover:bg-light-gray"
                          >
                            <Eye className="h-4 w-4 mr-2 text-primary-blue" />
                            <span className="text-dark-text">View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-dark-text"
                  >
                    No sales found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-dark-text">per page</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isPending}
              className="h-9 border-border-gray hover:bg-light-gray shadow-none disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-dark-text"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page as number)}
                    disabled={isPending}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isPending}
              className="h-9 border-border-gray hover:bg-light-gray shadow-none disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
        {pagination && (
          <p className="text-center text-sm text-dark-text mt-3">
            Showing {startIndex + 1} to {endIndex} of {pagination.totalCount}{" "}
            entries
          </p>
        )}
      </div>
    </div>
  );
}
