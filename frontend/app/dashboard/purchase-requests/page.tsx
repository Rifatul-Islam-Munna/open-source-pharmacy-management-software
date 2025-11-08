"use client";

import { useState, ChangeEvent } from "react";
import {
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Eye,
  Check,
  ChevronsUpDown,
  ArrowUpDown,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

interface Medicine {
  label: string;
  value: string;
}
const MEDICINES: Medicine[] = [
  { label: "Amoxicillin 500mg", value: "amoxicillin-500mg" },
  { label: "Ibuprofen 200mg", value: "ibuprofen-200mg" },
  { label: "Paracetamol 500mg", value: "paracetamol-500mg" },
  { label: "Cetirizine 10mg", value: "cetirizine-10mg" },
  { label: "Omeprazole 20mg", value: "omeprazole-20mg" },
];

interface PurchaseOrder {
  id: string;
  medicine: string;
  batch: string;
  quantity: number;
  status: "pending" | "ordered" | "received";
  requestDate: Date;
}

const sampleOrders: PurchaseOrder[] = [
  {
    id: "PO-101",
    medicine: "Amoxicillin 500mg",
    batch: "BATCH-0912A",
    quantity: 30,
    status: "pending",
    requestDate: new Date("2025-11-08T09:38:00"),
  },
  {
    id: "PO-103",
    medicine: "Ibuprofen 200mg",
    batch: "BATCH-0022B",
    quantity: 60,
    status: "ordered",
    requestDate: new Date("2025-11-06T15:04:00"),
  },
  {
    id: "PO-122",
    medicine: "Paracetamol 500mg",
    batch: "BATCH-8888X",
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

  // Filter text for command input inside popover
  const [inputValue, setInputValue] = useState("");

  // Filtering data
  let filtered = orders.filter(
    (row) =>
      (statusTab === "all" || row.status === statusTab) &&
      (row.medicine.toLowerCase().includes(search.toLowerCase()) ||
        row.batch.toLowerCase().includes(search.toLowerCase()))
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
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const viewRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
    }
  };

  // Selection handlers
  function onSelectRow(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  }

  function onSelectAll(checked: boolean) {
    const ids = checked ? viewRows.map((row) => row.id) : [];
    setSelectedIds(ids);
  }

  function onDeleteAll() {
    setOrders((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
  }

  function onAcceptAll() {
    setOrders((prev) =>
      prev.map((row) =>
        selectedIds.includes(row.id) && row.status === "pending"
          ? { ...row, status: "ordered" }
          : row
      )
    );
  }

  function onCancel(id: string) {
    setOrders((prev) => prev.filter((row) => row.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  function onAddRequest() {
    setModalOpen(true);
    setSelectedMedicine("");
    setQuantity(1);
    setInputValue("");
  }

  function handleModalSubmit() {
    if (!selectedMedicine) return;
    const label =
      MEDICINES.find((m) => m.value === selectedMedicine)?.label ||
      selectedMedicine;
    const newOrder: PurchaseOrder = {
      id: `PO-${Math.floor(Math.random() * 100000)}`,
      medicine: label,
      batch: "", // no batch
      quantity,
      status: "pending",
      requestDate: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setModalOpen(false);
  }

  // CSV Download utility
  function downloadCSV() {
    const headers = ["Medicine", "Batch", "Qty", "Status", "Requested"];
    const rows = orders.map((o) =>
      [
        o.medicine,
        o.batch,
        o.quantity,
        o.status,
        formatDT(o.requestDate, true),
      ].join(",")
    );
    const blob = new Blob([[headers.join(",")].concat(rows).join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase-requests.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-md mx-auto">
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
        <DialogContent className="max-w-xl w-full">
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
                    className="w-[200px] justify-between"
                  >
                    {selectedMedicine
                      ? MEDICINES.find((m) => m.value === selectedMedicine)
                          ?.label ?? selectedMedicine
                      : "Select medicine..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      autoFocus
                      placeholder="Search medicine..."
                      className="h-9"
                      value={inputValue}
                      onValueChange={setInputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <CommandList>
                      <CommandEmpty>No medicine found.</CommandEmpty>
                      <CommandGroup>
                        {MEDICINES.filter((m) =>
                          m.label
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        ).map((med) => (
                          <CommandItem
                            key={med.value}
                            value={med.value}
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
                            {med.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                selectedMedicine === med.value
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

            {/* Quantity Input */}
            <div className="w-full">
              <Label
                htmlFor="quantity"
                className="mb-2 block font-medium text-sm text-dark-text"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Number(e.target.value))
                }
                className="w-full rounded-md border border-border-gray px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
              />
            </div>
          </section>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              disabled={!selectedMedicine || quantity < 1}
              onClick={handleModalSubmit}
            >
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
          placeholder="Search by medicine or batch..."
          className="max-w-xs h-9 border-border-gray shadow-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex gap-1 bg-light-gray p-1 rounded border border-border-gray">
          {(["all", "pending", "ordered", "received"] as const).map((st) => (
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
              <ArrowUpDown className="h-4 w-4" />
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
                  <Label htmlFor="qty-desc">Qty: High to Low</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="qty-asc" id="qty-asc" />
                  <Label htmlFor="qty-asc">Qty: Low to High</Label>
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
              <TableHead>Medicine (Batch)</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {viewRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-dark-text"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              viewRows.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-light-gray/30 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(order.id)}
                      onCheckedChange={(v) => onSelectRow(order.id, !!v)}
                      aria-label={`Select order ${order.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-dark-blue">
                      {order.medicine}
                    </div>
                    <div className="text-xs text-dark-text/60">
                      {order.batch}
                    </div>
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{statusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {formatDT(order.requestDate, true)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-border-gray hover:bg-primary-blue/10"
                        title="View"
                        aria-label={`View order ${order.id}`}
                      >
                        <Eye className="h-4 w-4 text-primary-blue" />
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-border-gray hover:bg-red-100"
                          title="Cancel"
                          aria-label={`Cancel order ${order.id}`}
                          onClick={() => onCancel(order.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                      {order.status === "ordered" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-border-gray hover:bg-success/20"
                          title="Mark as Received"
                          aria-label={`Mark order ${order.id} as received`}
                          onClick={() =>
                            setOrders((prev) =>
                              prev.map((row) =>
                                row.id === order.id
                                  ? { ...row, status: "received" }
                                  : row
                              )
                            )
                          }
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                      )}
                    </div>
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
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="h-9 border-border-gray shadow-none"
          >
            Previous
          </Button>
          {[
            ...Array.from(Array(totalPages).keys())
              .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
              .map((i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  className={`h-8 w-8 rounded-full ${
                    page === i + 1
                      ? "bg-primary-blue text-white"
                      : "border-border-gray text-dark-text"
                  }`}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                  aria-label={`Go to page ${i + 1}`}
                >
                  {i + 1}
                </Button>
              )),
          ]}
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="h-9 border-border-gray shadow-none"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
