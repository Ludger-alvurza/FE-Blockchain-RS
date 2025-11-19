import { Suspense } from "react";
import EditPatientContent from "@/components/EditPatientContent";

export default function EditPatientPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditPatientContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="text-center">Loading data pasien...</div>
    </div>
  );
}
