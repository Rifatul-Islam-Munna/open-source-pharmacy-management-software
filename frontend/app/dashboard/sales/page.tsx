"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar,
} from "lucide-react";

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

// Demo sales data
const demoSales = [
  {
    id: "INV-001",
    customerName: "John Anderson",
    customerPhone: "+880 1712-345678",
    medicines: ["Paracetamol 500mg", "Amoxicillin 250mg", "Ibuprofen 200mg"],
    totalPrice: 450.5,
    status: "paid",
    date: new Date("2024-12-20"),
    issuedBy: "Admin User",
  },
  {
    id: "INV-002",
    customerName: null,
    customerPhone: null,
    medicines: ["Cetirizine 10mg", "Omeprazole 20mg"],
    totalPrice: 85.25,
    status: "paid",
    date: new Date("2024-12-20"),
    issuedBy: "Cashier 1",
  },
  {
    id: "INV-003",
    customerName: "Sarah Williams",
    customerPhone: "+880 1823-456789",
    medicines: ["Aspirin 81mg"],
    totalPrice: 125.0,
    status: "due",
    date: new Date("2024-12-19"),
    issuedBy: "Admin User",
  },
  {
    id: "INV-004",
    customerName: "Michael Brown",
    customerPhone: "+880 1934-567890",
    medicines: [
      "Metformin 500mg",
      "Atorvastatin 10mg",
      "Lisinopril 5mg",
      "Aspirin 75mg",
    ],
    totalPrice: 380.0,
    status: "paid",
    date: new Date("2024-12-19"),
    issuedBy: "Cashier 2",
  },
  {
    id: "INV-005",
    customerName: null,
    customerPhone: null,
    medicines: ["Loratadine 10mg", "Dextromethorphan 15mg"],
    totalPrice: 56.5,
    status: "paid",
    date: new Date("2024-12-18"),
    issuedBy: "Admin User",
  },
  {
    id: "INV-006",
    customerName: "Emily Johnson",
    customerPhone: "+880 1645-678901",
    medicines: ["Azithromycin 500mg"],
    totalPrice: 280.75,
    status: "due",
    date: new Date("2024-12-18"),
    issuedBy: "Cashier 1",
  },
  {
    id: "INV-007",
    customerName: "David Martinez",
    customerPhone: "+880 1756-789012",
    medicines: ["Prednisone 5mg", "Montelukast 10mg"],
    totalPrice: 195.0,
    status: "paid",
    date: new Date("2024-12-17"),
    issuedBy: "Admin User",
  },
  {
    id: "INV-008",
    customerName: null,
    customerPhone: null,
    medicines: ["Levothyroxine 50mcg", "Metoprolol 25mg", "Gabapentin 300mg"],
    totalPrice: 412.3,
    status: "paid",
    date: new Date("2024-12-17"),
    issuedBy: "Cashier 2",
  },
];

export default function SalesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Filter and sort sales
  let filteredSales = demoSales.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerPhone?.includes(searchQuery);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(sale.status);
    return matchesSearch && matchesStatus;
  });

  // Sort sales
  filteredSales.sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return a.date.getTime() - b.date.getTime();
      case "date-desc":
        return b.date.getTime() - a.date.getTime();
      case "price-asc":
        return a.totalPrice - b.totalPrice;
      case "price-desc":
        return b.totalPrice - a.totalPrice;
      case "invoice-asc":
        return a.id.localeCompare(b.id);
      case "invoice-desc":
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

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
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Sales History</h1>
        <p className="text-sm text-dark-text mt-0.5">
          View all sales transactions and invoices
        </p>
      </div>

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
              {paginatedSales.length > 0 ? (
                paginatedSales.map((sale) => (
                  <TableRow
                    key={sale.id}
                    className="hover:bg-light-gray transition-colors"
                  >
                    <TableCell className="font-medium text-dark-blue">
                      {sale.id}
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
                        {sale.medicines.slice(0, 2).map((med, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-light-gray px-2 py-0.5 rounded text-xs"
                          >
                            {med}
                          </span>
                        ))}
                        {sale.medicines.length > 2 && (
                          <span className="text-xs text-dark-text/60">
                            +{sale.medicines.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-dark-text font-semibold">
                      ${sale.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell className="text-dark-text text-sm">
                      {formatDate(sale.date)}
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
                            onClick={() =>
                              router.push(`/sales/view/${sale.id}`)
                            }
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
                    className="px-3 py-1 text-dark-text"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
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
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)}{" "}
          of {filteredSales.length} entries
        </p>
      </div>
    </div>
  );
}
