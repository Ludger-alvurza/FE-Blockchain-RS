// app/access-control/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import AccessControlTable from "@/components/AccessControlTable";
import LoadingFallback from "@/components/LoadingFallback";
import { AccessControl } from "@/interfaces";

export const dynamic = "force-dynamic";

async function fetchAccessControls(): Promise<AccessControl[]> {
  try {
    const res = await fetch("http://localhost:3001/access-controls", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // Transform data to match AccessControl interface
    return data.map((item: any) => ({
      ...item,
      valid_to: item.valid_to || "",
      on_chain_tx: item.on_chain_tx || "",
    }));
  } catch (error) {
    console.error("Error fetching access controls:", error);
    return [];
  }
}

async function AccessControlList() {
  const accessControls = await fetchAccessControls();

  if (accessControls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Belum ada access control.
        </p>
        <Link
          href="/create-control-access"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tambah Access Control
        </Link>
      </div>
    );
  }

  return <AccessControlTable accessControls={accessControls} />;
}

export default function AccessControlPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Access Control Management</h1>
        <Link
          href="/create-control-access"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Tambah Access Control
        </Link>
      </div>

      <Suspense
        fallback={<LoadingFallback message="Memuat access controls..." />}
      >
        <AccessControlList />
      </Suspense>
    </div>
  );
}
