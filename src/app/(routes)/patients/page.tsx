// app/patients/page.tsx
import { Suspense } from "react";
import { Patient } from "@/interfaces/index";
import PatientCard from "@/components/PatientCard";
import LoadingFallback from "@/components/LoadingFallback";

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("http://localhost:3001/patients", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

async function PatientList() {
  const patients = await fetchPatients();

  if (patients.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">Belum ada pasien.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {patients.map((patient) => (
        <PatientCard key={patient.patient_id} patient={patient} />
      ))}
    </ul>
  );
}

export default function PatientPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Pasien</h1>
      <Suspense
        fallback={<LoadingFallback message="Memuat daftar pasien..." />}
      >
        <PatientList />
      </Suspense>
    </div>
  );
}
