// components/PatientCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/interfaces/index";
import { useToast } from "@/providers/ToastProvider";
import ConfirmationDialog from "./ConfirmationDialog";

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/edit-patients?patient_id=${patient.patient_id.trim()}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const trimmedPatientId = patient.patient_id.trim();
      const res = await fetch(
        `http://localhost:3001/patients/${trimmedPatientId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        showToast("Pasien berhasil dihapus", "success");
        setShowDeleteDialog(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const data = await res.json();
        showToast(data.error || "Gagal menghapus pasien", "error");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      showToast("Terjadi kesalahan saat menghapus pasien", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  // Helper function untuk format display
  const formatArrayDisplay = (field: any) => {
    if (!field) return "N/A";
    if (Array.isArray(field)) {
      return field.join(", ");
    }
    if (typeof field === "string") {
      return field;
    }
    return "N/A";
  };

  return (
    <>
      <li className="p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold">{patient.full_name}</h3>
            <p className="text-xs text-zinc-500">ID: {patient.patient_id}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {/* Informasi Dasar */}
          <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b">
            <div>
              <p className="text-xs text-zinc-500 font-medium">Gender</p>
              <p>{patient.gender || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">
                Golongan Darah
              </p>
              <p>{patient.blood_type || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Tanggal Lahir</p>
              <p>
                {patient.birth_date
                  ? new Date(patient.birth_date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Umur</p>
              <p>
                {patient.birth_date
                  ? new Date().getFullYear() -
                    new Date(patient.birth_date).getFullYear() +
                    " tahun"
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Kontak & Alamat */}
          <div className="mb-3 pb-3 border-b">
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                DID Wallet:
              </strong>{" "}
              <span className="font-mono text-xs break-all">
                {patient.wallet_did}
              </span>
            </p>
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                No HP:
              </strong>{" "}
              {patient.contact_phone || "N/A"}
            </p>
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                Alamat:
              </strong>{" "}
              {patient.address || "N/A"}
            </p>
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                Kontak Darurat:
              </strong>{" "}
              {patient.emergency_contact || "N/A"}
            </p>
          </div>

          {/* Informasi Kesehatan */}
          <div className="mb-3 pb-3 border-b">
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                Asuransi:
              </strong>{" "}
              {formatArrayDisplay(patient.insurance)}
            </p>
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                Alergi:
              </strong>{" "}
              {formatArrayDisplay(patient.allergies)}
            </p>
            <p>
              <strong className="text-zinc-600 dark:text-zinc-400">
                Kondisi Kronis:
              </strong>{" "}
              {formatArrayDisplay(patient.chronic_conditions)}
            </p>
          </div>

          {/* Metadata */}
          <p className="text-xs text-zinc-500 pt-2 border-t">
            <strong>Dibuat:</strong>{" "}
            {new Date(patient.created_at).toLocaleString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </li>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Hapus Pasien"
        message={`Apakah Anda yakin ingin menghapus data pasien "${patient.full_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
