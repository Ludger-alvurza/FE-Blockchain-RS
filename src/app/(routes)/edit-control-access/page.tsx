import { notFound } from "next/navigation";
import EditAccessControlForm from "@/components/EditAccessControlForm";
import { AccessControl, PageProps } from "@/interfaces";

// Server Component - Fetch data
async function getAccessControl(id: string): Promise<AccessControl | null> {
  try {
    const res = await fetch(`http://localhost:3001/access-controls/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // Transform data to match AccessControl interface
    return {
      ...data,
      valid_to: data.valid_to || "",
      on_chain_tx: data.on_chain_tx || "",
    };
  } catch (error) {
    console.error("Error fetching access control:", error);
    return null;
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const acId = params.id;

  if (!acId) {
    return {
      title: "Access Control Tidak Ditemukan",
    };
  }

  const accessControl = await getAccessControl(acId);

  if (!accessControl) {
    return {
      title: "Access Control Tidak Ditemukan",
    };
  }

  return {
    title: `Edit Access Control - ${accessControl.patient_id}`,
  };
}

export default async function EditAccessControlPage({
  searchParams,
}: PageProps) {
  // AWAIT searchParams dulu!
  const params = await searchParams;
  const acId = params.id;

  if (!acId) {
    notFound();
  }

  const accessControl = await getAccessControl(acId);

  if (!accessControl) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Edit Access Control
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          AC ID: <span className="font-mono">{accessControl.ac_id}</span>
        </p>
      </div>

      <EditAccessControlForm initialData={accessControl} acId={acId} />
    </div>
  );
}
