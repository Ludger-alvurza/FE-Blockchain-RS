// app/patients/page.tsx
import { Patient } from "@/interfaces/index";
import PatientCard from "@/components/PatientCard";

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("http://localhost:3001/patients", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export default async function PatientPage() {
  let patients: Patient[] = [];

  try {
    patients = await fetchPatients();
  } catch (error) {
    console.error("Failed to fetch patients:", error);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Pasien</h1>

      {patients.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">Belum ada pasien.</p>
      ) : (
        <ul className="space-y-4">
          {patients.map((patient) => (
            <PatientCard key={patient.patient_id} patient={patient} />
          ))}
        </ul>
      )}
    </div>
  );
}
