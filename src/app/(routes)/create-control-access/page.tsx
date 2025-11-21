// app/create-access-control/page.tsx
import AccessControlForm from "@/components/AccessControlForm";

export default function CreateAccessControlPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tambah Access Control Baru</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Berikan akses kepada user untuk mengakses data pasien tertentu
        </p>
      </div>

      <AccessControlForm />
    </div>
  );
}
