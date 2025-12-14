"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  TrendingUp,
  Check,
  Eye,
  Loader2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useDebounce } from "use-debounce";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { MedicineResponse } from "@/@types/inventory";
import { format, isValid, parseISO } from "date-fns";
import { MedicineDetailsModal } from "@/components/custom/inventory/medicine-details-modal";
import { EditMedicineModal } from "@/components/custom/inventory/edit-medicine-modal";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { useUser } from "@/hooks/useUser";
import { DatePicker } from "./DatePicker";

// Demo data with proper date format
const demoMedicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    expiryDate: new Date("2026-11-10"),
    stockStatus: "in-stock",
    unitPrice: 7.2,
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    expiryDate: new Date("2028-12-10"),
    stockStatus: "low-stock",
    unitPrice: 6.5,
  },
  {
    id: "3",
    name: "Ibuprofen 200mg",
    expiryDate: new Date("2029-11-13"),
    stockStatus: "in-stock",
    unitPrice: 12.0,
  },
  {
    id: "4",
    name: "Loratadine 10mg",
    expiryDate: new Date("2027-01-10"),
    stockStatus: "low-stock",
    unitPrice: 8.0,
  },
  {
    id: "5",
    name: "Aspirin 81mg",
    expiryDate: new Date("2026-01-02"),
    stockStatus: "out-of-stock",
    unitPrice: 18.25,
  },
  {
    id: "6",
    name: "Cetirizine 10mg",
    expiryDate: new Date("2027-05-15"),
    stockStatus: "in-stock",
    unitPrice: 5.5,
  },
  {
    id: "7",
    name: "Omeprazole 20mg",
    expiryDate: new Date("2028-08-22"),
    stockStatus: "in-stock",
    unitPrice: 9.75,
  },
  {
    id: "8",
    name: "Metformin 500mg",
    expiryDate: new Date("2029-03-18"),
    stockStatus: "low-stock",
    unitPrice: 4.25,
  },
];

export default function InventoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [date, setDate] = useState<undefined | Date>(undefined);
  const { user } = useUser();
  console.log("new Date", date?.toLocaleDateString());
  // Filter states
  const [selectedStockStatus, setSelectedStockStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name-asc");
  const [text] = useDebounce(searchQuery, 1000);
  const query = new URLSearchParams();
  if (text.length > 3) query.append("searchQuery", text);
  query.append("page", currentPage.toString());
  query.append("limit", itemsPerPage.toString());
  if (date) query.append("createdDate", date.toLocaleDateString());
  if (selectedStockStatus?.length > 0)
    selectedStockStatus?.forEach((item) => query.append("stockStatus", item));
  query.append("sortBy", sortBy);
  console.log("urls", `/shop?${query.toString()}`);
  useEffect(() => {
    const getCall = () => {
      setCurrentPage(1);
    };
    getCall();
  }, [text, selectedStockStatus, sortBy, date]);
  const { data, isPending, refetch } = useQueryWrapper<MedicineResponse>(
    [
      "get-my-inventory",
      text,
      currentPage,
      itemsPerPage,
      selectedStockStatus,
      sortBy,
      date?.toLocaleDateString(),
    ],
    `/shop?${query.toString()}`
  );
  const { mutate, isPending: IsDeteleting } = useCommonMutationApi({
    method: "DELETE",
    url: "/shop/delete-shop-medicine",
    successMessage: "Medicine deleted successfully",
    onSuccess: () => {
      refetch();
    },
  });
  // Format date
  const formatDate = (dateString: string): string | null => {
    // Parse the date string to a Date object
    const date = parseISO(dateString);

    // Check if the date is valid
    if (!isValid(date)) {
      return "N/A"; // or throw an error if you prefer
    }

    // Format the date
    return format(date, "MMMM dd, yyyy"); // Example: December 10, 2028
  };

  // Filter and sort medicines
  let filteredMedicines = demoMedicines.filter((medicine) => {
    const matchesSearch = medicine.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStockStatus.length === 0 ||
      selectedStockStatus.includes(medicine.stockStatus);
    return matchesSearch && matchesStatus;
  });

  // Sort medicines
  filteredMedicines.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.unitPrice - b.unitPrice;
      case "price-desc":
        return b.unitPrice - a.unitPrice;
      case "expiry-asc":
        return a.expiryDate.getTime() - b.expiryDate.getTime();
      case "expiry-desc":
        return b.expiryDate.getTime() - a.expiryDate.getTime();
      default:
        return 0;
    }
  });

  const totalPages = data?.meta?.totalPages ?? 1;

  // Paginate
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    setSelectedMedicine(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting medicine:", selectedMedicine);
    setDeleteDialogOpen(false);
    setSelectedMedicine(null);
  };

  const getStockBadge = (totalUnits: number) => {
    if (totalUnits > 5) {
      // In stock
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
          In Stock
        </Badge>
      );
    } else if (totalUnits > 0 && totalUnits <= 5) {
      // Low stock
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20">
          Low Stock
        </Badge>
      );
    } else if (totalUnits <= 0) {
      // Out of stock
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
          Out of Stock
        </Badge>
      );
    } else {
      return "N/A";
    }
  };

  const toggleStockStatus = (status: string) => {
    setSelectedStockStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Generate page numbers
  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 2; // Show 3 pages before and after current page
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    // Always include first page, current page range, and last page
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        range.push(i);
      }
    }

    // Add ellipsis where needed
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          // Only one page gap, show the number
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          // Multiple pages gap, show ellipsis
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Product Inventory</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Manage and track all pharmacy products.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="px-4">
        <div className="flex items-center gap-3 justify-center flex-col md:flex-row flex-wrap md:justify-between">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
            <Input
              placeholder="Search by product name or SKU..."
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
                {selectedStockStatus.length > 0 && (
                  <Badge className="ml-2 bg-primary-blue text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {selectedStockStatus.length}
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
                    Stock Status
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "in-stock", label: "In Stock" },
                      { value: "low-stock", label: "Low Stock" },
                      { value: "out-of-stock", label: "Out of Stock" },
                    ].map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={status.value}
                          checked={selectedStockStatus.includes(status.value)}
                          onCheckedChange={() =>
                            toggleStockStatus(status.value)
                          }
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
                      setSelectedStockStatus([]);
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
                      { value: "name-asc", label: "Name (A-Z)" },
                      { value: "name-desc", label: "Name (Z-A)" },
                      { value: "price-asc", label: "Price (Low to High)" },
                      { value: "price-desc", label: "Price (High to Low)" },
                      {
                        value: "quantity-asc",
                        label: "Quantity (High to Low)",
                      },
                      {
                        value: "quantity-desc",
                        label: "Quantity (Low to High)",
                      },
                      { value: "expiry-asc", label: "Expiry (Earliest)" },
                      { value: "expiry-desc", label: "Expiry (Latest)" },
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

          <DatePicker date={date} setDate={setDate} />

          <Button
            onClick={() => router.push("/dashboard/add-medicine")}
            className="h-10 bg-primary-blue hover:bg-dark-blue text-white shadow-none md:ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="px-4">
        <div className="border overflow-x-auto border-border-gray rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-light-gray hover:bg-light-gray">
                <TableHead className="font-semibold text-dark-text">
                  PRODUCT NAME
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  EXPIRY DATE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  STOCK STATUS
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  PURCHASE PRICE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  UNIT PRICE
                </TableHead>
                <TableHead className="font-semibold text-dark-text">
                  IN STOCK
                </TableHead>
                <TableHead className="font-semibold text-dark-text text-right">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.data?.length ?? 0) > 0 ? (
                data?.data?.map((medicine) => (
                  <TableRow
                    key={medicine?._id}
                    className="hover:bg-light-gray transition-colors"
                  >
                    <TableCell className="align-top ">
                      <div className="flex flex-wrap flex-col max-w-[290px] overflow-x-auto">
                        <span className="font-medium text-dark-blue mr-1">
                          {medicine?.name}-
                        </span>
                        <span className="text-xs   text-muted-foreground flex flex-col">
                          <span className="truncate wrap-break-word  overflow-x-hidden">
                            {medicine?.shopMedicineId?.generic}
                          </span>
                          <span> {medicine?.shopMedicineId?.strength}</span>
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-dark-text">
                      {formatDate(medicine?.expiryDate)}
                    </TableCell>
                    <TableCell>{getStockBadge(medicine?.totalUnits)}</TableCell>
                    <TableCell className="text-dark-text">
                      ৳{medicine?.purchasePrice?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-dark-text">
                      ৳{medicine?.sellingPrice?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-dark-text">
                      {medicine?.totalUnits}
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
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer hover:bg-light-gray"
                          >
                            <EditMedicineModal
                              medicine={medicine}
                              trigger={
                                <div className="flex items-center w-full">
                                  <Edit className="h-4 w-4 mr-2 text-primary-blue" />
                                  <span className="text-dark-text">
                                    Edit Medicine
                                  </span>
                                </div>
                              }
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault(); // Prevent dropdown from closing
                            }}
                            className="cursor-pointer hover:bg-light-gray"
                            disabled={user?.role !== "admin"}
                          >
                            <MedicineDetailsModal
                              trigger={
                                <div className="flex items-center w-full">
                                  <Eye className="h-4 w-4 mr-2 text-primary-blue" />
                                  <span className="text-dark-text">
                                    View Details
                                  </span>
                                </div>
                              }
                              medicine={medicine}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled
                            className="cursor-pointer hover:bg-light-gray"
                          >
                            <TrendingUp className="h-4 w-4 mr-2 text-success" />
                            <span className="text-dark-text">View Sales</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border-gray" />
                          <DropdownMenuItem
                            onClick={() => mutate(medicine?._id)}
                            className="cursor-pointer hover:bg-red-50 text-red-600"
                            disabled={IsDeteleting}
                          >
                            {IsDeteleting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-dark-text"
                  >
                    No products found.
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
              {getPaginationRange(currentPage, totalPages)?.map((page, index) =>
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
                    className={`h-9 w-9 p-0 shadow-none rounded-full  ${
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
          {Math.min(endIndex, data?.data?.length ?? 0)} of {data?.meta?.total}{" "}
          entries
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="shadow-none border-border-gray">
          <DialogHeader>
            <DialogTitle className="text-dark-blue">
              Delete Medicine
            </DialogTitle>
            <DialogDescription className="text-dark-text">
              Are you sure you want to delete this medicine? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-border-gray hover:bg-light-gray shadow-none"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white shadow-none"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
