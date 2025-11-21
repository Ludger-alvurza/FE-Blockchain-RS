"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Shield, Clock } from "lucide-react";
import { Props, ScopeData } from "@/interfaces";
import { useToast } from "@/providers/ToastProvider";
import ConfirmationDialog from "./ConfirmationDialog";

export default function AccessControlTable({ accessControls }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAC = accessControls.find((item) => item.ac_id === selectedId);

  const handleDeleteClick = (ac_id: string) => {
    setSelectedId(ac_id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleting(selectedId);
    try {
      const res = await fetch(
        `http://localhost:3001/access-controls/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      showToast("Access control berhasil dihapus", "success");
      router.refresh();
    } catch (error) {
      console.error("Error deleting access control:", error);
      alert("Gagal menghapus access control");
    } finally {
      setShowDeleteDialog(false);
      setDeleting(null);
      setSelectedId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isActive = (validFrom: string | null, validTo: string | null) => {
    const now = new Date();
    const from = validFrom ? new Date(validFrom) : null;
    const to = validTo ? new Date(validTo) : null;

    if (from && from > now) return false;
    if (to && to < now) return false;
    return true;
  };

  const renderScope = (scope: ScopeData) => {
    return (
      <div className="space-y-1">
        <div className="flex gap-1 flex-wrap">
          {scope.read && (
            <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium">
              Read
            </span>
          )}
          {scope.write && (
            <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded font-medium">
              Write
            </span>
          )}
          {scope.delete && (
            <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded font-medium">
              Delete
            </span>
          )}
        </div>
        {scope.read && scope.fields && scope.fields.length > 0 && (
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Fields: {scope.fields.length}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Patient ID</th>
              <th className="text-left p-4 font-semibold">Granted To</th>
              <th className="text-left p-4 font-semibold">Granted By</th>
              <th className="text-left p-4 font-semibold">Valid Period</th>
              <th className="text-left p-4 font-semibold">Scope</th>
              <th className="text-right p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accessControls.map((ac) => {
              const active = isActive(ac.valid_from, ac.valid_to);
              return (
                <tr
                  key={ac.ac_id}
                  className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {active ? (
                        <>
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {ac.patient_id?.slice(0, 8) || "-"}...
                    </code>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {ac.granted_to.slice(0, 8)}...
                    </code>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {ac.granted_by?.slice(0, 8) || "-"}...
                    </code>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-zinc-600 dark:text-zinc-400">
                        {formatDate(ac.valid_from)}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-500 text-xs">
                        to {formatDate(ac.valid_to)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {ac.scope ? (
                      renderScope(ac.scope)
                    ) : (
                      <span className="text-zinc-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/edit-control-access?id=${ac.ac_id}`)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(ac.ac_id)}
                        disabled={deleting === ac.ac_id}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Hapus Access Control"
        message={
          selectedAC
            ? `Apakah Anda yakin ingin menghapus access control milik pasien "${selectedAC.patient_id}"? Tindakan ini tidak dapat dibatalkan.`
            : "Apakah Anda yakin ingin menghapus access control ini?"
        }
        confirmText="Hapus"
        cancelText="Batal"
        isDangerous={true}
        isLoading={deleting !== null}
        onConfirm={handleDelete}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
