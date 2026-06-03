import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Trash2, UserCog, Shield } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';


export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string, name: string) => setDeleteTarget({id, name});

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      await adminApi.deleteUser(deleteTarget.id);
      setUsers(users.filter(u => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error: any) {
      setDeleteTarget(null);
      setDeleteError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-gray-400 mt-1">View and manage platform users.</p>
        </div>
        <div className="bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
          <UserCog className="w-4 h-4" />
          Total: {users.length}
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
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4">Semester</th>
                <th scope="col" className="px-6 py-4">Joined At</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shrink-0">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        Student
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{user.semester || '-'}</td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.fullName)}
                      disabled={user.role === 'ADMIN'}
                      className={`p-2 rounded-lg transition-colors ${
                        user.role === 'ADMIN'
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title={user.role === 'ADMIN' ? "Cannot delete admin" : "Delete User"}
                      aria-label={user.role === 'ADMIN' ? 'Tidak dapat menghapus admin' : `Hapus pengguna ${user.fullName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus pengguna ${deleteTarget?.name ?? ''}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
