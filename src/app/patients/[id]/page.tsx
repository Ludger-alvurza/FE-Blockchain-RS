import { notFound } from "next/navigation";
import { Patient, PatientDetailPageProps } from "@/interfaces";

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3001/patients/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const patient: Patient = await res.json();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Detail Pasien</h1>

      <div className="p-6 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 space-y-3">
        <h2 className="text-xl font-semibold">{patient.full_name}</h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>DID Wallet:</strong>
            <span className="ml-2 text-zinc-600 dark:text-zinc-400 font-mono">
              {patient.wallet_did}
            </span>
          </p>

          <p>
            <strong>No HP:</strong>
            <span className="ml-2 text-zinc-600 dark:text-zinc-400">
              {patient.contact_phone || "N/A"}
            </span>
          </p>

          <p>
            <strong>Alamat:</strong>
            <span className="ml-2 text-zinc-600 dark:text-zinc-400">
              {patient.address || "N/A"}
            </span>
          </p>

          <p>
            <strong>Tanggal Lahir:</strong>
            <span className="ml-2 text-zinc-600 dark:text-zinc-400">
              {patient.birth_date
                ? new Date(patient.birth_date).toLocaleDateString("id-ID")
                : "N/A"}
            </span>
          </p>

          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">
            Dibuat: {new Date(patient.created_at).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
