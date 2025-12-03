"use client";

import { useState, ChangeEvent } from "react";
import {
  CheckCircle as Check,
  XCircle,
  Plus,
  Download,
  ChevronsUpDown,
  MoreVertical,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { useDebounce } from "use-debounce";
import { Medicine } from "@/@types/global-medicin";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { OrdersResponse } from "@/@types/purches-req";
import { format, isValid, parseISO } from "date-fns";
import Pagination from "@/components/custom/Pagination";
import { getToken } from "@/api-hooks/api-hook";

interface PurchaseOrder {
  id: string;
  medicine: string;
  quantity: number;
  status: "pending" | "ordered" | "received" | "cancelled";
  requestDate: Date;
}

const sampleOrders: PurchaseOrder[] = [
  {
    id: "PO-101",
    medicine: "Amoxicillin 500mg",
    quantity: 30,
    status: "pending",
    requestDate: new Date("2025-11-08T09:38:00"),
  },
  {
    id: "PO-103",
    medicine: "Ibuprofen 200mg",
    quantity: 60,
    status: "ordered",
    requestDate: new Date("2025-11-06T15:04:00"),
  },
  {
    id: "PO-122",
    medicine: "Paracetamol 500mg",
    quantity: 100,
    status: "pending",
    requestDate: new Date("2025-11-07T18:21:00"),
  },
];

function formatDT(date: Date | undefined, withTime = false) {
  if (!date) return "—";
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }) +
    (withTime
      ? `, ${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "")
  );
}

export default function PurchaseRequestsPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<
    "all" | "pending" | "ordered" | "received"
  >("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "qty-desc" | "qty-asc"
  >("date-desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  // Medicine selector controlled states
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [medicinePopoverOpen, setMedicinePopoverOpen] = useState(false);

  // Input Quantity for modal
  const [quantity, setQuantity] = useState(1);
  const [inputValueQuantity, setInputValueQuantity] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch] = useDebounce(inputValue, 1000);
  const query = new URLSearchParams();
  if (debouncedSearch?.length > 3) query.append("name", debouncedSearch);
  const { data } = useQueryWrapper<Medicine[]>(
    ["medicines", debouncedSearch],
    `/medicine?${query.toString()}`
  );

  const params = new URLSearchParams();
  const [text] = useDebounce(search, 1000);
  if (text.length > 2) params.set("search", text);
  params.set("page", page.toString());
  params.set("rowsPerPage", rowsPerPage.toString());
  params.set("sortBy", sortBy);
  params.set("status", statusTab);

  const {
    data: OrderData,
    isPending,
    refetch,
  } = useQueryWrapper<OrdersResponse>(
    ["medicines", text, page, rowsPerPage, sortBy, statusTab],
    `/purchase-order?${params.toString()}`
  );

  // Filter text for command input inside popover

  // Filtering data
  let filtered = orders.filter(
    (row) =>
      (statusTab === "all" || row.status === statusTab) &&
      row.medicine.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting logic
  filtered.sort((a, b) => {
    if (sortBy === "date-desc")
      return b.requestDate.getTime() - a.requestDate.getTime();
    if (sortBy === "date-asc")
      return a.requestDate.getTime() - b.requestDate.getTime();
    if (sortBy === "qty-asc") return a.quantity - b.quantity;
    if (sortBy === "qty-desc") return b.quantity - a.quantity;
    return 0;
  });

  // Pagination

  const viewRows = OrderData?.data ?? [];

  // Status badge helper
  const statusBadge = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
            Pending
          </Badge>
        );
      case "ordered":
        return (
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/40 text-xs">
            Ordered
          </Badge>
        );
      case "received":
        return (
          <Badge className="bg-success/20 text-success border-success/40 text-xs">
            Received
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/20  text-red-800 border-red-500/40 text-xs">
            cancelled
          </Badge>
        );
    }
  };

  // Selection handlers
  function onSelectRow(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  }

  function onSelectAll(checked: boolean) {
    if (!OrderData) return;
    const ids = checked ? OrderData?.data?.map((row) => row._id) : [];
    setSelectedIds(ids);
  }
  const { mutate: updteMultiple, isPending: isUpdating } = useCommonMutationApi(
    {
      method: "PATCH",
      url: "/purchase-order/updated-multiple",
      successMessage: "Request updated successfully",
      onSuccess(data) {
        refetch();
        setSelectedIds([]);
      },
    }
  );

  function onDeleteAll() {
    updteMultiple({ ids: selectedIds, type: "delete" });
  }

  function onAcceptAll() {
    updteMultiple({ ids: selectedIds, type: "approve" });
    console.log(selectedIds);
  }
  const { mutate: updateStatus, isPending: IsStatusPending } =
    useCommonMutationApi({
      method: "PATCH",
      url: "/purchase-order/updated",
      successMessage: "Request updated successfully",
      onSuccess(data) {
        refetch();
      },
    });
  const onStatusChange = (id: string, status: string) => {
    const data = {
      id,
      status,
    };
    updateStatus(data);
  };

  function onCancel(id: string) {
    const data = {
      id,
      status: "cancelled",
    };
    updateStatus(data);
  }

  function onAddRequest() {
    setModalOpen(true);
    setSelectedMedicine("");
    setQuantity(1);
    setInputValue("");
  }
  const { mutate, isPending: IsOrderPending } = useCommonMutationApi({
    method: "POST",
    url: "/purchase-order",
    successMessage: "Request added successfully",
    onSuccess(data) {
      setModalOpen(false);
      refetch();
    },
  });

  function handleModalSubmit() {
    if (!selectedMedicine) return;

    const newOrder = {
      medicine: selectedMedicine,
      ...(quantity > 0 && { box: quantity }),
      ...(inputValueQuantity > 0 && { quantity: inputValueQuantity }),

      status: "pending",
    };
    mutate(newOrder);

    console.log("post-data", newOrder);
  }

  // CSV Download utility
  async function downloadCSV() {
    const { access_token } = await getToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/purchase-order/download-csv`, {
        method: "GET",
        headers: {
          access_token: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the blob (file data)
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "medicine-order.csv";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("CSV downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
    }
  }

  return (
    <div className="space-y-6 bg-white p-6   mx-auto">
      {/* Header and actions */}
      <div className="border-b border-border-gray pb-3 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">
            Purchase Requests
          </h1>
          <p className="text-sm text-dark-text mt-1">
            All pending and active medicine order requests
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadCSV}
            variant="outline"
            className="h-9 border-primary-blue text-primary-blue hover:bg-primary-blue/20 flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download
          </Button>
          <Button
            onClick={onAddRequest}
            className="h-9 bg-primary-blue hover:bg-dark-blue text-white flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Purchase Request
          </Button>
        </div>
      </div>

      {/* Add Purchase Request Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className=" min-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Add Purchase Request</DialogTitle>
          </DialogHeader>
          <section className="flex flex-col gap-6 py-4">
            {/* Medicine Combobox with Popover */}
            <div className="w-full">
              <Label
                htmlFor="medicine-combobox"
                className="mb-2 block font-medium text-sm text-dark-text"
              >
                Medicine
              </Label>
              <Popover
                open={medicinePopoverOpen}
                onOpenChange={setMedicinePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="medicine-combobox"
                    variant="outline"
                    role="combobox"
                    aria-expanded={medicinePopoverOpen}
                    className=" max-w-3xl justify-between"
                  >
                    {selectedMedicine ? selectedMedicine : "Select medicine..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" w-2xl  p-0">
                  <Command>
                    <CommandInput
                      autoFocus
                      placeholder="Search medicine..."
                      className="h-9"
                      value={inputValue}
                      onValueChange={setInputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <CommandList className=" ">
                      <CommandEmpty>No medicine found.</CommandEmpty>
                      <CommandGroup>
                        {data?.map((med) => (
                          <CommandItem
                            key={med.name}
                            value={`${med.name}-${med.dosageType}-${med.strength}-${med.generic}-${med.manufacturer}-`}
                            onSelect={(currentValue) => {
                              setSelectedMedicine(
                                currentValue === selectedMedicine
                                  ? ""
                                  : currentValue
                              );
                              setMedicinePopoverOpen(false);
                              setInputValue("");
                            }}
                            className="flex items-center justify-between"
                          >
                            {med.name}-{" "}
                            <span className=" text-green-700">
                              ({med.dosageType})
                            </span>
                            <span className=" text-dark-blue">
                              ({med.strength})
                            </span>
                            <span className=" text-green-70">
                              ({med.generic})
                            </span>
                            <span className=" text-green-700">
                              ({med.manufacturer})
                            </span>
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedMedicine === med.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <span className=" text-xs text-green-600">
              Either Box or Number do not include both box mean whole box and
              how many you are ordering
            </span>

            {/* Quantity Input */}
            <div className="w-full">
              <Label
                htmlFor="quantity"
                className="mb-2 block font-medium text-sm text-dark-text"
              >
                Quantity (Box)
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity > 0 ? quantity : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Number(e.target.value))
                }
                className="w-full rounded-md border border-border-gray px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
            <div className="w-full">
              <Label
                htmlFor="quantity"
                className="mb-2 block font-medium text-sm text-dark-text"
              >
                Quantity (Number)
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={inputValueQuantity > 0 ? inputValueQuantity : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValueQuantity(Number(e.target.value))
                }
                className="w-full rounded-md border border-border-gray px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
          </section>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              disabled={
                !selectedMedicine ||
                (quantity || inputValueQuantity) < 1 ||
                IsOrderPending
              }
              onClick={handleModalSubmit}
            >
              {IsOrderPending && <Loader2 className="animate-spin mr-2" />}{" "}
              Submit
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 px-1">
        <Input
          placeholder="Search by medicine..."
          className="max-w-xs h-9 border-border-gray shadow-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex gap-1 bg-light-gray p-1 rounded border border-border-gray">
          {(
            ["all", "pending", "ordered", "received", "cancelled"] as const
          ).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusTab === st ? "default" : "ghost"}
              onClick={() => {
                setStatusTab(st);
                setPage(1);
              }}
              className={`h-8 px-3 text-xs ${
                statusTab === st
                  ? "bg-primary-blue text-white"
                  : "text-dark-text hover:bg-white"
              }`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </Button>
          ))}
        </div>
        <Popover open={sortOpen} onOpenChange={setSortOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border-gray hover:bg-light-gray flex items-center gap-1"
            >
              <MoreVertical className="h-4 w-4" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 shadow-none border-border-gray p-3">
            <RadioGroup
              value={sortBy}
              onValueChange={(v) => {
                setSortBy(v);
                setSortOpen(false);
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="date-desc" id="date-desc" />
                  <Label htmlFor="date-desc">Newest First</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="date-asc" id="date-asc" />
                  <Label htmlFor="date-asc">Oldest First</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="qty-desc" id="qty-desc" />
                  <Label htmlFor="qty-desc">Box: High to Low</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="qty-asc" id="qty-asc" />
                  <Label htmlFor="qty-asc">Box: Low to High</Label>
                </div>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
        <Checkbox
          checked={
            viewRows.length > 0 && selectedIds.length === viewRows.length
          }
          onCheckedChange={(v) => onSelectAll(!!v)}
          className="ml-2"
          aria-label="Select all visible rows"
        />
        <Button
          variant="outline"
          className="h-9 border-green-200 text-success hover:bg-green-50"
          disabled={selectedIds.length === 0}
          onClick={onAcceptAll}
        >
          Accept All
        </Button>
        <Button
          variant="outline"
          className="h-9 border-red-200 text-red-600 hover:bg-red-50"
          disabled={selectedIds.length === 0}
          onClick={onDeleteAll}
        >
          Delete All
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-border-gray shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-light-gray text-dark-text">
              <TableHead>
                <Checkbox
                  checked={
                    viewRows.length > 0 &&
                    selectedIds.length === viewRows.length
                  }
                  onCheckedChange={(v) => onSelectAll(!!v)}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Box</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {OrderData?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-dark-text"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              OrderData?.data?.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-light-gray/30 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(order._id)}
                      onCheckedChange={(v) => onSelectRow(order._id, !!v)}
                      aria-label={`Select order ${order._id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-dark-blue">
                      {order.medicine}
                    </div>
                  </TableCell>
                  <TableCell>
                    {order?.box ? `${order.box} Box` : `${order?.quantity} Pcs`}
                  </TableCell>
                  <TableCell>{statusBadge(order?.status)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {isValid(parseISO(order.createdAt))
                        ? format(order.createdAt, "dd MMM yyyy")
                        : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-1 flex justify-center items-center"
                          aria-label={`Open actions for ${order._id}`}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-3 flex flex-col gap-3">
                        <RadioGroup
                          value={order.status}
                          onValueChange={(v) => onStatusChange(order._id, v)}
                          disabled={IsStatusPending}
                        >
                          <div className="flex flex-col gap-2">
                            <RadioGroupItem
                              value="pending"
                              id={`pending-${order._id}`}
                            />
                            <Label htmlFor={`pending-${order._id}`}>
                              Pending
                            </Label>
                            <RadioGroupItem
                              value="ordered"
                              id={`ordered-${order._id}`}
                            />
                            <Label htmlFor={`ordered-${order._id}`}>
                              Ordered
                            </Label>
                            <RadioGroupItem
                              value="received"
                              id={`received-${order._id}`}
                            />
                            <Label htmlFor={`received-${order._id}`}>
                              Received
                            </Label>
                          </div>
                        </RadioGroup>

                        {order.status !== "received" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onCancel(order._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text select-none">Show</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(v) => {
              setRowsPerPage(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-20 border-border-gray shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="shadow-none border-border-gray">
              {[6, 12, 24, 36].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-dark-text select-none">per page</span>
        </div>
        <div className="flex items-center gap-2">
          <Pagination
            currentPage={page}
            totalPages={OrderData?.totalPages ?? 1}
            hasNextPage={(OrderData?.totalPages ?? 1) > page}
            hasPrevPage={page > 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
