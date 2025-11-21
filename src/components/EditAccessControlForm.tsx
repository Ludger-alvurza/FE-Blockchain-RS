"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/ToastProvider";
import { AccessControl, EditAccessControlFormProps } from "@/interfaces";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";

const AVAILABLE_FIELDS = [
  "full_name",
  "gender",
  "blood_type",
  "date_of_birth",
  "phone_number",
  "email",
  "address",
  "medical_history",
  "allergies",
  "medications",
  "lab_results",
  "diagnoses",
  "treatment_plans",
  "vital_signs",
  "notes",
];

export default function EditAccessControlForm({
  initialData,
  acId,
}: EditAccessControlFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const [fieldInput, setFieldInput] = useState("");

  const [formData, setFormData] = useState<AccessControl>({
    ...initialData,
    valid_from: new Date(initialData.valid_from).toISOString().slice(0, 16),
    valid_to: initialData.valid_to
      ? new Date(initialData.valid_to).toISOString().slice(0, 16)
      : "",
    on_chain_tx: initialData.on_chain_tx || "",
    // FIX: Pastikan scope.fields selalu array
    scope: {
      read: initialData.scope?.read ?? false,
      write: initialData.scope?.write ?? false,
      delete: initialData.scope?.delete ?? false,
      fields: Array.isArray(initialData.scope?.fields)
        ? initialData.scope.fields
        : [],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validasi required fields
      if (!formData.patient_id || !formData.patient_id.trim()) {
        throw new Error("Patient ID wajib diisi!");
      }

      if (!formData.granted_to || !formData.granted_to.trim()) {
        throw new Error("Granted To (User ID) wajib diisi!");
      }

      if (!formData.granted_by || !formData.granted_by.trim()) {
        throw new Error("Granted By (Admin ID) wajib diisi!");
      }

      // Validasi datetime
      if (!formData.valid_from) {
        throw new Error("Valid From wajib diisi!");
      }

      const validFrom = new Date(formData.valid_from);
      if (isNaN(validFrom.getTime())) {
        throw new Error("Format Valid From tidak valid!");
      }

      if (formData.valid_to && formData.valid_to.trim()) {
        const validTo = new Date(formData.valid_to);
        if (isNaN(validTo.getTime())) {
          throw new Error("Format Valid To tidak valid!");
        }
        if (validTo <= validFrom) {
          throw new Error("Valid To harus setelah Valid From!");
        }
      }

      // Validasi minimal satu permission dipilih
      const permissionSelected =
        formData.scope.read || formData.scope.write || formData.scope.delete;
      if (!permissionSelected) {
        throw new Error(
          "Minimal satu permission (Read/Write/Delete) harus dipilih!"
        );
      }

      // Jika read dipilih, field harus ada minimal 1
      if (formData.scope.read && formData.scope.fields.length === 0) {
        throw new Error("Jika Read dipilih, minimal 1 field harus dipilih!");
      }

      // Payload untuk database
      const payload = {
        patient_id: formData.patient_id.trim(),
        granted_to: formData.granted_to.trim(),
        granted_by: formData.granted_by.trim(),
        scope: {
          read: formData.scope.read,
          write: formData.scope.write,
          delete: formData.scope.delete,
          fields: formData.scope.fields,
        },
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to:
          formData.valid_to && formData.valid_to.trim()
            ? new Date(formData.valid_to).toISOString()
            : null,
        on_chain_tx:
          formData.on_chain_tx && formData.on_chain_tx.trim()
            ? formData.on_chain_tx.trim()
            : null,
      };

      const res = await fetch(`http://localhost:3001/access-controls/${acId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error: ${res.statusText}`);
      }
      showToast("Access control berhasil diperbarui", "success");
      setSuccess(true);

      // Redirect
      setTimeout(() => {
        router.push("/access-control");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak diketahui");
    } finally {
      setLoading(false);
    }
  };

  const addField = (field: string) => {
    if (!formData.scope.fields.includes(field)) {
      setFormData((prev) => ({
        ...prev,
        scope: {
          ...prev.scope,
          fields: [...prev.scope.fields, field],
        },
      }));
    }
    setFieldInput("");
  };

  const removeField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      scope: {
        ...prev.scope,
        fields: prev.scope.fields.filter((f) => f !== field),
      },
    }));
  };

  const togglePermission = (perm: "read" | "write" | "delete") => {
    setFormData((prev) => ({
      ...prev,
      scope: {
        ...prev.scope,
        [perm]: !prev.scope[perm],
      },
    }));
  };

  const filteredFields = AVAILABLE_FIELDS.filter(
    (f) =>
      f.toLowerCase().includes(fieldInput.toLowerCase()) &&
      !formData.scope.fields.includes(f)
  );

  const isFormValid =
    formData.patient_id.trim() &&
    formData.granted_to.trim() &&
    formData.granted_by.trim() &&
    formData.valid_from &&
    (formData.scope.read || formData.scope.write || formData.scope.delete) &&
    (formData.scope.read ? formData.scope.fields.length > 0 : true);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 max-w-3xl">
      <h2 className="text-lg font-semibold mb-6">Edit Access Control</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-600 dark:text-green-400 text-sm">
            Access control berhasil diperbarui!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* AC ID - Read Only */}
        <div>
          <label className="block text-sm font-medium mb-2">AC ID</label>
          <input
            type="text"
            value={formData.ac_id}
            disabled
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            ID tidak bisa diubah
          </p>
        </div>

        {/* Patient ID */}
        <div>
          <label
            htmlFor="patient_id"
            className="block text-sm font-medium mb-2"
          >
            Patient ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patient_id"
            value={formData.patient_id}
            onChange={(e) =>
              setFormData({ ...formData, patient_id: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="cth: pt_987654321"
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            UUID pasien dari tabel patients
          </p>
        </div>

        {/* Granted To */}
        <div>
          <label
            htmlFor="granted_to"
            className="block text-sm font-medium mb-2"
          >
            Granted To (User ID) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="granted_to"
            value={formData.granted_to}
            onChange={(e) =>
              setFormData({ ...formData, granted_to: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="cth: doctor_1234"
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            ID user (dokter/staff) yang diberi akses
          </p>
        </div>

        {/* Granted By */}
        <div>
          <label
            htmlFor="granted_by"
            className="block text-sm font-medium mb-2"
          >
            Granted By (Admin ID) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="granted_by"
            value={formData.granted_by}
            onChange={(e) =>
              setFormData({ ...formData, granted_by: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="cth: hospital_admin_1"
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            ID admin yang mengotorisasi akses
          </p>
        </div>

        {/* Scope - Permissions */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Permissions <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.scope.read}
                onChange={() => togglePermission("read")}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className="font-medium text-sm">Read</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Dapat melihat/membaca data pasien (pilih field)
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.scope.write}
                onChange={() => togglePermission("write")}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className="font-medium text-sm">Write</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Dapat mengubah/update data pasien
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={formData.scope.delete}
                onChange={() => togglePermission("delete")}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className="font-medium text-sm">Delete</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Dapat menghapus data pasien
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Field Level Access */}
        {formData.scope.read && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <label className="block text-sm font-medium mb-3">
              Pilih Field yang Boleh Diakses{" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Field Search Input */}
            <div className="mb-3 relative">
              <input
                type="text"
                value={fieldInput}
                onChange={(e) => setFieldInput(e.target.value)}
                placeholder="Cari atau ketik field..."
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />

              {/* Suggestions */}
              {fieldInput && filteredFields.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                  {filteredFields.map((field) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => addField(field)}
                      className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm text-zinc-900 dark:text-white transition-colors"
                    >
                      {field}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Fields */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {formData.scope.fields.length === 0
                  ? "Belum ada field dipilih"
                  : `${formData.scope.fields.length} field dipilih`}
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.scope.fields.map((field) => (
                  <div
                    key={field}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {field}
                    <button
                      type="button"
                      onClick={() => removeField(field)}
                      className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Select All */}
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    scope: {
                      ...prev.scope,
                      fields: AVAILABLE_FIELDS,
                    },
                  }))
                }
                className="text-xs px-3 py-1 bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 text-blue-900 dark:text-blue-100 rounded transition-colors"
              >
                Pilih Semua Field
              </button>
            </div>
          </div>
        )}

        {/* Valid From */}
        <div>
          <label
            htmlFor="valid_from"
            className="block text-sm font-medium mb-2"
          >
            Valid From <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="valid_from"
            value={formData.valid_from}
            onChange={(e) =>
              setFormData({ ...formData, valid_from: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Kapan akses mulai berlaku
          </p>
        </div>

        {/* Valid To */}
        <div>
          <label htmlFor="valid_to" className="block text-sm font-medium mb-2">
            Valid To
          </label>
          <input
            type="datetime-local"
            id="valid_to"
            value={formData.valid_to}
            onChange={(e) =>
              setFormData({ ...formData, valid_to: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Kapan akses berakhir (kosongkan untuk unlimited)
          </p>
        </div>

        {/* On Chain Transaction */}
        <div>
          <label
            htmlFor="on_chain_tx"
            className="block text-sm font-medium mb-2"
          >
            On-Chain Transaction Hash
          </label>
          <input
            type="text"
            id="on_chain_tx"
            value={formData.on_chain_tx}
            onChange={(e) =>
              setFormData({ ...formData, on_chain_tx: e.target.value })
            }
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="0xabc123def456ghi7890001122334455"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Optional: Transaction hash dari blockchain (untuk audit trail)
          </p>
        </div>

        {/* Created At - Read Only */}
        <div>
          <label className="block text-sm font-medium mb-2">Created At</label>
          <input
            type="text"
            value={new Date(formData.created_at).toLocaleString("id-ID")}
            disabled
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Kapan access control dibuat
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/access-control"
          className="flex items-center gap-2 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed ml-auto font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
