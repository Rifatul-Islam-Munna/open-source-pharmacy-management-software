"use client";

import { useState, ViewTransition } from "react";
import { CalendarIcon, Sparkles, Upload, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicineStore } from "@/stores/medicine-store";
import { cn } from "@/lib/utils";

// Sample medicine list for combobox
const medicineOptions = [
  { value: "paracetamol-500", label: "Paracetamol 500mg" },
  { value: "amoxicillin-250", label: "Amoxicillin 250mg" },
  { value: "ibuprofen-400", label: "Ibuprofen 400mg" },
  { value: "aspirin-75", label: "Aspirin 75mg" },
  { value: "cetirizine-10", label: "Cetirizine 10mg" },
];

export default function AddMedicinePage() {
  const {
    currentMedicine,
    updateCurrentMedicine,
    updateQuantity,
    addMedicine,
    clearCurrentMedicine,
  } = useMedicineStore();

  const [openCombobox, setOpenCombobox] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSave = () => {
    if (!currentMedicine?.name || !currentMedicine?.batchName) {
      alert("Please fill in required fields");
      return;
    }

    const medicine = {
      id: Date.now().toString(),
      name: currentMedicine.name,
      batchName: currentMedicine.batchName,
      expiryDate: currentMedicine.expiryDate,
      purchasePrice: currentMedicine.purchasePrice || 0,
      sellingPrice: currentMedicine.sellingPrice || 0,
      quantity: currentMedicine.quantity || {
        boxes: 0,
        cartonPerBox: 0,
        stripsPerCarton: 0,
        unitsPerStrip: 0,
      },
      totalUnits: currentMedicine.totalUnits || 0,
      imageUrl: imagePreview || undefined,
    };

    addMedicine(medicine);
    clearCurrentMedicine();
    setImageFile(null);
    setImagePreview(null);
  };

  const totalUnits = currentMedicine?.totalUnits || 0;

  return (
    <div className="space-y-3">
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Add New Medicine</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Add medicine manually or detect from image
        </p>
      </div>

      <Tabs defaultValue="manual" className="px-4">
        <TabsList className="bg-light-gray border border-border-gray">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
          >
            Manual Entry
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
          >
            Detect from Image
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-3 mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Medicine Information */}
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Medicine Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label
                    htmlFor="medicine-name"
                    className="text-sm text-dark-text"
                  >
                    Medicine Name <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between mt-1.5 h-9 border-border-gray hover:border-primary-blue shadow-none text-sm"
                      >
                        {currentMedicine?.name || "Select medicine..."}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 shadow-none border-border-gray">
                      <Command>
                        <CommandInput
                          placeholder="Search medicine..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No medicine found.</CommandEmpty>
                          <CommandGroup>
                            {medicineOptions.map((medicine) => (
                              <CommandItem
                                key={medicine.value}
                                value={medicine.value}
                                onSelect={() => {
                                  updateCurrentMedicine({
                                    name: medicine.label,
                                  });
                                  setOpenCombobox(false);
                                }}
                                className="hover:bg-light-gray text-sm"
                              >
                                {medicine.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label
                    htmlFor="batch-name"
                    className="text-sm text-dark-text"
                  >
                    Batch Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="batch-name"
                    placeholder="e.g., BATCH2024-001"
                    value={currentMedicine?.batchName || ""}
                    onChange={(e) =>
                      updateCurrentMedicine({ batchName: e.target.value })
                    }
                    className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="expiry-date"
                    className="text-sm text-dark-text"
                  >
                    Expiry Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1.5 h-9 border-border-gray hover:border-primary-blue shadow-none text-sm",
                          !currentMedicine?.expiryDate &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentMedicine?.expiryDate ? (
                          format(currentMedicine.expiryDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-none border-border-gray">
                      <Calendar
                        mode="single"
                        selected={currentMedicine?.expiryDate}
                        onSelect={(date) =>
                          updateCurrentMedicine({ expiryDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Calculator */}
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Quantity Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="boxes" className="text-xs text-dark-text">
                      Boxes
                    </Label>
                    <Input
                      id="boxes"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentMedicine?.quantity?.boxes || ""}
                      onChange={(e) =>
                        updateQuantity({
                          boxes: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cartons" className="text-xs text-dark-text">
                      Cartons/Box
                    </Label>
                    <Input
                      id="cartons"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentMedicine?.quantity?.cartonPerBox || ""}
                      onChange={(e) =>
                        updateQuantity({
                          cartonPerBox: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="strips" className="text-xs text-dark-text">
                      Strips/Carton
                    </Label>
                    <Input
                      id="strips"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentMedicine?.quantity?.stripsPerCarton || ""}
                      onChange={(e) =>
                        updateQuantity({
                          stripsPerCarton: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="units" className="text-xs text-dark-text">
                      Units/Strip
                    </Label>
                    <Input
                      id="units"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentMedicine?.quantity?.unitsPerStrip || ""}
                      onChange={(e) =>
                        updateQuantity({
                          unitsPerStrip: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                    />
                  </div>
                </div>

                <div className="bg-light-gray p-2.5 rounded-lg border border-border-gray">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-blue font-semibold text-sm">
                      Total Units:
                    </span>
                    <span className="text-xl font-bold text-primary-blue">
                      {totalUnits.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-dark-text mt-1">
                    {[
                      currentMedicine?.quantity?.boxes &&
                        `${currentMedicine.quantity.boxes} boxes`,
                      currentMedicine?.quantity?.cartonPerBox &&
                        `${currentMedicine.quantity.cartonPerBox} cartons`,
                      currentMedicine?.quantity?.stripsPerCarton &&
                        `${currentMedicine.quantity.stripsPerCarton} strips`,
                      currentMedicine?.quantity?.unitsPerStrip &&
                        `${currentMedicine.quantity.unitsPerStrip} units`,
                    ]
                      .filter(Boolean)
                      .join(" × ") || "Enter quantities to calculate"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border-gray shadow-none lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="purchase-price"
                      className="text-sm text-dark-text"
                    >
                      Purchase Price (per unit)
                    </Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text text-sm">
                        $
                      </span>
                      <Input
                        id="purchase-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={currentMedicine?.purchasePrice || ""}
                        onChange={(e) =>
                          updateCurrentMedicine({
                            purchasePrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="pl-7 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="selling-price"
                      className="text-sm text-dark-text"
                    >
                      Selling Price (per unit)
                    </Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text text-sm">
                        $
                      </span>
                      <Input
                        id="selling-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={currentMedicine?.sellingPrice || ""}
                        onChange={(e) =>
                          updateCurrentMedicine({
                            sellingPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="pl-7 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                clearCurrentMedicine();
                setImagePreview(null);
                setImageFile(null);
              }}
              className="h-9 border-border-gray hover:bg-light-gray shadow-none text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-9 bg-primary-blue hover:bg-dark-blue text-white shadow-none text-sm"
            >
              Save Medicine
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="image" className="mt-3">
          <Card className="border-border-gray shadow-none">
            <CardContent className="p-4">
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-border-gray rounded-lg p-10 text-center hover:border-primary-blue transition-colors cursor-pointer bg-light-gray/30"
                >
                  <Sparkles className="mx-auto h-16 w-16 text-primary-blue mb-4" />
                  <h3 className="text-xl font-semibold text-dark-blue mb-2">
                    AI-Powered Detection
                  </h3>
                  <p className="text-dark-text mb-1 text-sm">
                    Upload a fresh and clear image of your receipt or medicine
                    package
                  </p>
                  <p className="text-dark-text/70 mb-6 text-xs">
                    Make sure the text is readable and well-lit • PNG, JPG, WEBP
                    (max 5MB)
                  </p>

                  <label htmlFor="ai-file-upload">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-success hover:bg-success/90 text-white shadow-none h-9"
                      onClick={() =>
                        document.getElementById("ai-file-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Detect
                    </Button>
                  </label>

                  <input
                    id="ai-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  <div className="mt-6 pt-6 border-t border-border-gray">
                    <p className="text-xs text-dark-text font-medium mb-2">
                      Tips for best results:
                    </p>
                    <ul className="text-xs text-dark-text/70 space-y-0.5 text-left max-w-md mx-auto">
                      <li>• Ensure good lighting without shadows or glare</li>
                      <li>• Keep the image focused and not blurry</li>
                      <li>• Capture the entire receipt or package label</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative bg-light-gray/50 rounded-lg p-3">
                    <img
                      src={imagePreview}
                      alt="Medicine for detection"
                      className="w-full rounded-lg border border-border-gray max-h-96 object-contain mx-auto"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-5 right-5 shadow-none h-8 w-8"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-light-gray border border-border-gray rounded-lg p-3">
                    <p className="text-xs text-dark-text">
                      Review your image. If unclear, upload a better quality
                      image for accurate results.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 border-border-gray hover:bg-light-gray shadow-none text-sm"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                    >
                      Upload Different
                    </Button>
                    <Button
                      className="flex-1 h-9 bg-success hover:bg-success/90 text-white shadow-none text-sm"
                      onClick={() => {
                        alert("AI detection would run here");
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Detect Info
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
