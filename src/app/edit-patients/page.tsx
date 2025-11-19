"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/providers/ToastProvider";

export default function EditPatientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const patientId = searchParams.get("patient_id");

  const [form, setForm] = useState({
    wallet_did: "",
    full_name: "",
    birth_date: "",
    gender: "",
    blood_type: "",
    contact_phone: "",
    address: "",
    emergency_contact: "",
    insurance: "",
    allergies: "",
    chronic_conditions: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch patient data saat component mount
  useEffect(() => {
    if (!patientId) {
      setMessage("Patient ID tidak ditemukan");
      setFetching(false);
      return;
    }

    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const res = await fetch(`http://localhost:3001/patients/${patientId}`);
      const data = await res.json();

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Gagal mengambil data pasien");
        showToast(data.error || "Gagal mengambil data pasien", "error");
        setFetching(false);
        return;
      }

      // Format birth_date dari ISO ke YYYY-MM-DD untuk input date
      const birthDate = data.birth_date
        ? new Date(data.birth_date).toISOString().split("T")[0]
        : "";

      // Convert JSON array to comma-separated text
      const formatArrayField = (field: any) => {
        if (!field) return "";
        if (Array.isArray(field)) {
          return field.join(", ");
        }
        if (typeof field === "string") {
          return field;
        }
        return "";
      };

      setForm({
        wallet_did: data.wallet_did || "",
        full_name: data.full_name || "",
        birth_date: birthDate,
        gender: data.gender || "",
        blood_type: data.blood_type || "",
        contact_phone: data.contact_phone || "",
        address: data.address || "",
        emergency_contact: formatArrayField(data.emergency_contact),
        insurance: formatArrayField(data.insurance),
        allergies: formatArrayField(data.allergies),
        chronic_conditions: formatArrayField(data.chronic_conditions),
      });

      setFetching(false);
    } catch (err) {
      setMessage("Terjadi kesalahan saat mengambil data");
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.wallet_did) return "Wallet DID wajib diisi";
    if (!form.full_name) return "Nama lengkap wajib diisi";
    if (!form.gender) return "Gender wajib dipilih";
    return null;
  };

  // Helper function untuk convert text ke JSON array
  const convertToJsonArray = (text: string) => {
    if (!text || !text.trim()) return null;

    // Split by comma dan trim whitespace
    const items = text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return items.length > 0 ? items : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const error = validate();
    if (error) {
      setMessage(error);
      setLoading(false);
      return;
    }

    try {
      const formData = {
        ...form,
        birth_date: form.birth_date
          ? new Date(form.birth_date).toISOString()
          : null,
        insurance: convertToJsonArray(form.insurance),
        emergency_contact: convertToJsonArray(form.emergency_contact),
        allergies: convertToJsonArray(form.allergies),
        chronic_conditions: convertToJsonArray(form.chronic_conditions),
      };

      const res = await fetch(`http://localhost:3001/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Gagal mengupdate pasien.");
        showToast(data.error || "Gagal mengupdate pasien", "error");
      } else {
        setMessage("Pasien berhasil diupdate!");
        showToast("Pasien berhasil diupdate!", "success");
        // Redirect ke halaman list atau detail setelah 2 detik
        setTimeout(() => {
          router.push("/patients"); // Sesuaikan dengan route list patients kamu
        }, 2000);
      }
    } catch (err) {
      setMessage("Terjadi kesalahan server.");
      showToast("Terjadi kesalahan server", "error");
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center">Loading data pasien...</div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center text-red-600">
          Patient ID tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Edit Patient</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("berhasil")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Wallet DID */}
        <div>
          <label className="block mb-1 font-medium">Wallet DID</label>
          <input
            type="text"
            name="wallet_did"
            value={form.wallet_did}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block mb-1 font-medium">Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Gender (Dropdown) */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Pilih Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Blood Type */}
        <div>
          <label className="block mb-1 font-medium">Blood Type</label>
          <input
            type="text"
            name="blood_type"
            value={form.blood_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block mb-1 font-medium">Contact Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block mb-1 font-medium">Emergency Contact</label>
          <input
            type="text"
            name="emergency_contact"
            value={form.emergency_contact}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Nama & No HP kontak darurat"
          />
        </div>

        {/* Insurance */}
        <div>
          <label className="block mb-1 font-medium">Insurance</label>
          <input
            type="text"
            name="insurance"
            value={form.insurance}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Contoh: BPJS, Mandiri, Allianz"
          />
          <p className="text-xs text-zinc-500 mt-1">Pisahkan dengan koma (,)</p>
        </div>

        {/* Allergies */}
        <div>
          <label className="block mb-1 font-medium">Allergies</label>
          <input
            type="text"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Contoh: alergi kacang, alergi udang, alergi telur"
          />
          <p className="text-xs text-zinc-500 mt-1">Pisahkan dengan koma (,)</p>
        </div>

        {/* Chronic Conditions */}
        <div>
          <label className="block mb-1 font-medium">Chronic Conditions</label>
          <input
            type="text"
            name="chronic_conditions"
            value={form.chronic_conditions}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Contoh: Diabetes, Hipertensi, Asma"
          />
          <p className="text-xs text-zinc-500 mt-1">Pisahkan dengan koma (,)</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading || fetching}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Patient"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
