import React from "react";
import { Button } from "@/components/ui/button";

const sampleCsvContent = `name,dosageType,generic,strength,manufacturer,UnitPrice,PackageSize
Napa,Tablet,Paracetamol,500mg,Square Pharmaceuticals,10,"1 Box (10 tablets)"
Seclo,Capsule,Omeprazole,20mg,Square Pharmaceuticals,12,"1 Box (10 capsules)"
Renitid,Tablet,Ranitidine,150mg,Incepta Pharmaceuticals,6,"1 Box (10 tablets)"
Nexum,Capsule,Esomeprazole,20mg,Eskayef Pharmaceuticals,14,"1 Box (10 capsules)"
`;

export function DownloadSampleCsvButton() {
  const handleDownload = () => {
    const blob = new Blob([sampleCsvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-medicines.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} className="w-full max-w-xs">
      Download Sample CSV File
    </Button>
  );
}
