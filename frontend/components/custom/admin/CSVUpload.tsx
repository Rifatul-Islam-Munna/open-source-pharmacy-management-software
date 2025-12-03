"use client";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { parseCSVAction } from "@/actions/parse-csv";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

export function CSVUpload() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleUpload = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await parseCSVAction(formData);
        console.log("Server Action Result:", result);

        if (result.error) {
          setError(result.error);
        } else {
          setMedicines(result.medicines);
          queryClient.refetchQueries({ queryKey: ["medicines"], exact: false });
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Upload failed");
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      handleUpload(formData);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Parsing..." : "📤 Upload CSV Medicines"}
      </Button>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        name="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isPending}
      />
    </div>
  );
}
