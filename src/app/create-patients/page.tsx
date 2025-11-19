"use client";

import { useState } from "react";

export default function CreatePatientPage() {
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
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // validation helper
  const validate = () => {
    if (!form.wallet_did) return "Wallet DID wajib diisi";
    if (!form.full_name) return "Nama lengkap wajib diisi";
    if (!form.gender) return "Gender wajib dipilih";
    return null;
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
      // Convert birth_date to ISO DateTime format
      // Convert text fields to JSON format for jsonb columns
      const formData = {
        ...form,
        birth_date: form.birth_date
          ? new Date(form.birth_date).toISOString()
          : null,
        insurance: form.insurance ? JSON.stringify(form.insurance) : null,
        emergency_contact: form.emergency_contact
          ? JSON.stringify(form.emergency_contact)
          : null,
        allergies: form.allergies ? JSON.stringify(form.allergies) : null,
        chronic_conditions: form.chronic_conditions
          ? JSON.stringify(form.chronic_conditions)
          : null,
      };

      const res = await fetch("http://localhost:3001/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Gagal membuat pasien.");
      } else {
        setMessage("Pasien berhasil dibuat!");
        setForm({
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
      }
    } catch (err) {
      setMessage("Terjadi kesalahan server.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Create Patient</h1>

      {message && <div className="mb-4 p-3 rounded bg-gray-100">{message}</div>}

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
          />
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
          />
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
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </div>
    </div>
  );
}
