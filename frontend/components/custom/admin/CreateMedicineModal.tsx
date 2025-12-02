"use client";
import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Loader2 } from "lucide-react";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { useQueryClient } from "@tanstack/react-query";
import { revlidateGlobalMedicin } from "@/actions/Refresh-action";
import { DosageType } from "@/lib/staticData";

interface FormData {
  name: string;
  dosageType: string;
  generic: string;
  strength: string;
  manufacturer: string;
  UnitPrice: string;
  PackageSize: string;
}

interface CreateMedicineModalProps {
  triggerButton?: React.ReactNode;
}

export function CreateMedicineModal({
  triggerButton,
}: CreateMedicineModalProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    dosageType: "",
    generic: "",
    strength: "",
    manufacturer: "",
    UnitPrice: "",
    PackageSize: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Medicine name is required";
    if (!formData.dosageType.trim())
      newErrors.dosageType = "Dosage type is required";
    if (!formData.generic.trim())
      newErrors.generic = "Generic name is required";
    if (!formData.strength.trim()) newErrors.strength = "Strength is required";
    if (!formData.manufacturer.trim())
      newErrors.manufacturer = "Manufacturer is required";
    if (!formData.UnitPrice.trim())
      newErrors.UnitPrice = "Unit price is required";
    else if (
      isNaN(Number(formData.UnitPrice)) ||
      Number(formData.UnitPrice) <= 0
    ) {
      newErrors.UnitPrice = "Unit price must be a positive number";
    }
    if (!formData.PackageSize.trim())
      newErrors.PackageSize = "Package size is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCommonMutationApi({
    method: "POST",
    url: "/medicine",
    successMessage: "Medicine added successfully",

    onSuccess: async () => {
      setOpen(false);

      await revlidateGlobalMedicin();
      queryClient.refetchQueries({ queryKey: ["medicines"], exact: false });
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const dosageTypeOptions = [
    DosageType.Tablet,
    DosageType.Capsule,
    DosageType.Syrup,
    DosageType.Injection,
    DosageType.CapsuleControlledRelease,
    DosageType.CapsuleDelayedRelease,
    DosageType.CapsuleExtendedRelease,
    DosageType.CapsuleModifiedRelease,
    DosageType.CapsuleSustainedRelease,
    DosageType.CapsuleTimedRelease,
    DosageType.ChewableTablet,
    DosageType.ChewingGumTablet,
    DosageType.Cream,
    DosageType.DentalGel,
    DosageType.DialysisSolution,
    DosageType.DispersibleTablet,
    DosageType.EarDrop,
    DosageType.EffervescentGranules,
    DosageType.EffervescentPowder,
    DosageType.EffervescentTablet,
    DosageType.EmulsionForInfusion,
    DosageType.EyeCapsule,
    DosageType.FlashTablet,
    DosageType.Gel,
    DosageType.HandRub,
    DosageType.IMInjection,
    DosageType.IMIAInjection,
    DosageType.IMIVInjection,
    DosageType.IMSCInjection,
    DosageType.IVInfusion,
    DosageType.IVInjection,
    DosageType.IVInjectionOrInfusion,
    DosageType.IVSCInjection,
    DosageType.InhalationCapsule,
    DosageType.Inhaler,
    DosageType.IntraArticularInjection,
    DosageType.IntracameralInjection,
    DosageType.IntraspinalInjection,
    DosageType.IntratrachealSuspension,
    DosageType.IntravitrealInjection,
    DosageType.IrrigationSolution,
    DosageType.Liquid,
    DosageType.LiquidCleanserSoap,
    DosageType.LongActingInjection,
    DosageType.LongActingTablet,
    DosageType.Lotion,
    DosageType.MUPSTablet,
    DosageType.MedicatedBar,
    DosageType.Microgranules,
    DosageType.Mouthwash,
    DosageType.MuscleRub,
    DosageType.NailLacquer,
    DosageType.NasalDrop,
    DosageType.NasalOintment,
    DosageType.NasalSpray,
    DosageType.NebuliserSolution,
    DosageType.NebuliserSuspension,
    DosageType.OROSTablet,
    DosageType.OcularSpray,
    DosageType.Ointment,
    DosageType.OphthalmicEmulsion,
    DosageType.OphthalmicGel,
    DosageType.OphthalmicOintment,
    DosageType.OphthalmicSolution,
    DosageType.OphthalmicSuspension,
    DosageType.OralEmulsion,
    DosageType.OralGel,
    DosageType.OralPaste,
    DosageType.OralPowder,
    DosageType.OralSolubleFilm,
    DosageType.OralSolution,
    DosageType.OralSuspension,
    DosageType.PediatricDrops,
    DosageType.PowderForInjection,
    DosageType.PowderForSolution,
    DosageType.PowderForSuspension,
    DosageType.RectalOintment,
    DosageType.RectalSaline,
    DosageType.RespiratorSolution,
    DosageType.RetardTablet,
    DosageType.SCInjection,
    DosageType.ScalpLotion,
    DosageType.ScalpOintment,
    DosageType.ScalpSolution,
    DosageType.Shampoo,
    DosageType.Solution,
    DosageType.SolutionForInhalation,
    DosageType.SprinkleCapsule,
    DosageType.SublingualTablet,
    DosageType.Suppository,
    DosageType.SurgicalScrub,
    DosageType.TopicalGel,
    DosageType.TopicalPowder,
    DosageType.TopicalSolution,
    DosageType.TopicalSpray,
    DosageType.TopicalSuspension,
    DosageType.TransdermalPatch,
    DosageType.VaginalCream,
    DosageType.VaginalGel,
    DosageType.VaginalPessary,
    DosageType.VaginalSuppository,
    DosageType.VaginalTablet,
    DosageType.ViscoelasticSolution,
    DosageType.ViscousEyeDrop,
    DosageType.Other,
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className=" bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add New Medicine
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Medicine
          </DialogTitle>
          <DialogDescription>
            Add a new medicine to your pharmacy inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Medicine Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
                placeholder="e.g., Napa"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Dosage Type */}
            <div>
              <Label htmlFor="dosageType">Dosage Type *</Label>
              <Select
                value={formData.dosageType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, dosageType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dosage type" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {dosageTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dosageType && (
                <p className="text-sm text-red-600 mt-1">{errors.dosageType}</p>
              )}
            </div>

            {/* Generic */}
            <div>
              <Label htmlFor="generic">Generic Name *</Label>
              <Input
                id="generic"
                name="generic"
                value={formData.generic}
                onChange={handleChange}
                className={errors.generic ? "border-red-500" : ""}
                placeholder="e.g., Paracetamol"
              />
              {errors.generic && (
                <p className="text-sm text-red-600 mt-1">{errors.generic}</p>
              )}
            </div>

            {/* Strength */}
            <div>
              <Label htmlFor="strength">Strength *</Label>
              <Input
                id="strength"
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                className={errors.strength ? "border-red-500" : ""}
                placeholder="e.g., 500mg"
              />
              {errors.strength && (
                <p className="text-sm text-red-600 mt-1">{errors.strength}</p>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className={errors.manufacturer ? "border-red-500" : ""}
                placeholder="e.g., Square Pharmaceuticals"
              />
              {errors.manufacturer && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.manufacturer}
                </p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <Label htmlFor="UnitPrice">Unit Price (৳) *</Label>
              <Input
                id="UnitPrice"
                name="UnitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.UnitPrice}
                onChange={handleChange}
                className={errors.UnitPrice ? "border-red-500" : ""}
                placeholder="10"
              />
              {errors.UnitPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.UnitPrice}</p>
              )}
            </div>

            {/* Package Size */}
            <div className="md:col-span-2">
              <Label htmlFor="PackageSize">Package Size *</Label>
              <Input
                id="PackageSize"
                name="PackageSize"
                value={formData.PackageSize}
                onChange={handleChange}
                className={errors.PackageSize ? "border-red-500" : ""}
                placeholder="e.g., 1 Box (10 tablets)"
              />
              {errors.PackageSize && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.PackageSize}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Medicine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
