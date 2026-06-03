import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Trash2, Users } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export function AdminGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = (id: string, name: string) => setDeleteTarget({id, name});

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      await adminApi.deleteGroup(deleteTarget.id);
      setGroups(groups.filter(g => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error: any) {
      setDeleteTarget(null);
      setDeleteError(error.response?.data?.message || 'Failed to delete group');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Groups</h1>
          <p className="text-gray-400 mt-1">View and manage study groups.</p>
        </div>
      </div>

      {deleteError && (
        <div role="alert" className="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg">
          {deleteError}
        </div>
      )}

      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-black/20 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4">Group Name</th>
                <th scope="col" className="px-6 py-4">Subject</th>
                <th scope="col" className="px-6 py-4">Creator</th>
                <th scope="col" className="px-6 py-4 text-center">Members</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {groups.map(group => (
                <tr key={group.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{group.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/5 text-xs text-gray-300">
                      {group.subject?.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {group.creator?.fullName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-gray-300">
                      <Users className="w-3 h-3" /> {group._count?.members}/{group.maxMembers}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(group.id, group.name)}
                      className="p-2 rounded-lg transition-colors text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Group"
                      aria-label={`Hapus grup ${group.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No groups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Grup"
        message={`Apakah Anda yakin ingin menghapus grup "${deleteTarget?.name ?? ''}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
