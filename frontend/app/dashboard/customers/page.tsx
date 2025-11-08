"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Phone,
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
  DropdownMenuSeparator,
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

// Demo data
const demoCustomers = [
  {
    id: "1",
    name: "John Anderson",
    phone: "+880 1712-345678",
    medicines: ["Paracetamol 500mg", "Amoxicillin 250mg", "Ibuprofen 200mg"],
    totalDue: 450.5,
    purchaseDate: new Date("2024-12-15"),
    status: "pending",
  },
  {
    id: "2",
    name: "Sarah Williams",
    phone: "+880 1823-456789",
    medicines: ["Cetirizine 10mg", "Omeprazole 20mg"],
    totalDue: 0,
    purchaseDate: new Date("2024-12-10"),
    status: "completed",
  },
  {
    id: "3",
    name: "Michael Brown",
    phone: "+880 1934-567890",
    medicines: ["Aspirin 81mg"],
    totalDue: 125.0,
    purchaseDate: new Date("2024-12-18"),
    status: "pending",
  },
  {
    id: "4",
    name: "Emily Johnson",
    phone: "+880 1645-678901",
    medicines: ["Metformin 500mg", "Atorvastatin 10mg", "Lisinopril 5mg"],
    totalDue: 0,
    purchaseDate: new Date("2024-12-05"),
    status: "completed",
  },
  {
    id: "5",
    name: "David Martinez",
    phone: "+880 1756-789012",
    medicines: ["Loratadine 10mg", "Dextromethorphan 15mg"],
    totalDue: 280.75,
    purchaseDate: new Date("2024-12-20"),
    status: "pending",
  },
  {
    id: "6",
    name: "Lisa Thompson",
    phone: "+880 1867-890123",
    medicines: ["Azithromycin 500mg"],
    totalDue: 0,
    purchaseDate: new Date("2024-12-08"),
    status: "completed",
  },
  {
    id: "7",
    name: "Robert Garcia",
    phone: "+880 1978-901234",
    medicines: ["Prednisone 5mg", "Montelukast 10mg"],
    totalDue: 350.25,
    purchaseDate: new Date("2024-12-22"),
    status: "pending",
  },
  {
    id: "8",
    name: "Jennifer Lee",
    phone: "+880 1589-012345",
    medicines: ["Levothyroxine 50mcg", "Metoprolol 25mg"],
    totalDue: 0,
    purchaseDate: new Date("2024-12-12"),
    status: "completed",
  },
];

export default function CustomersPage() {
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

  // Filter and sort customers
  let filteredCustomers = demoCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(customer.status);
    return matchesSearch && matchesStatus;
  });

  // Sort customers
  filteredCustomers.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "due-asc":
        return a.totalDue - b.totalDue;
      case "due-desc":
        return b.totalDue - a.totalDue;
      case "date-asc":
        return a.purchaseDate.getTime() - b.purchaseDate.getTime();
      case "date-desc":
        return b.purchaseDate.getTime() - a.purchaseDate.getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 text-xs">
          Completed
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20 text-xs">
        Pending
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
        <h1 className="text-2xl font-bold text-dark-blue">Customers</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Manage customer credits and track payment dues.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
            <Input
              placeholder="Search by name or phone..."
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
                      { value: "pending", label: "Pending" },
                      { value: "completed", label: "Completed" },
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
                      { value: "name-asc", label: "Name (A-Z)" },
                      { value: "name-desc", label: "Name (Z-A)" },
                      { value: "due-desc", label: "Due (High to Low)" },
                      { value: "due-asc", label: "Due (Low to High)" },
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
                  CUSTOMER NAME
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  PHONE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  MEDICINES PURCHASED
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  TOTAL DUE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  PURCHASE DATE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  STATUS
                </TableHead>
                <TableHead className="font-semibold text-dark-text text-right">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-light-gray transition-colors"
                  >
                    <TableCell className="font-medium text-dark-blue">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-dark-text text-sm">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-dark-text/50" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-dark-text text-sm max-w-xs">
                      <div className="flex items-center gap-1">
                        {customer.medicines.slice(0, 2).map((med, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-light-gray px-2 py-0.5 rounded text-xs"
                          >
                            {med}
                          </span>
                        ))}
                        {customer.medicines.length > 2 && (
                          <span className="text-xs text-dark-text/60">
                            +{customer.medicines.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-dark-text font-semibold">
                      {customer.totalDue > 0 ? (
                        <span className="text-yellow-600">
                          ${customer.totalDue.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-success">$0.00</span>
                      )}
                    </TableCell>
                    <TableCell className="text-dark-text text-sm">
                      {formatDate(customer.purchaseDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
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
                              router.push(`/customers/view/${customer.id}`)
                            }
                            className="cursor-pointer hover:bg-light-gray"
                          >
                            <Eye className="h-4 w-4 mr-2 text-primary-blue" />
                            <span className="text-dark-text">View Details</span>
                          </DropdownMenuItem>
                          {customer.status === "pending" && (
                            <>
                              <DropdownMenuSeparator className="bg-border-gray" />
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log(
                                    "Mark as completed:",
                                    customer.id
                                  );
                                }}
                                className="cursor-pointer hover:bg-light-gray"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-success" />
                                <span className="text-dark-text">
                                  Mark as Completed
                                </span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-dark-text"
                  >
                    No customers found.
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
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredCustomers.length)} of{" "}
          {filteredCustomers.length} entries
        </p>
      </div>
    </div>
  );
}
