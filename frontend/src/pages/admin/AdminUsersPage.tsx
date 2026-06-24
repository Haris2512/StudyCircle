// File ini berisi komponen untuk halaman admin Users
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Trash2, UserCog, Shield, Search, Filter, ChevronLeft, ChevronRight, Edit2, X } from 'lucide-react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { gooeyToast } from 'goey-toast';
import { useDebounce } from '../../hooks/useDebounce';

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);
  
  // Edit Role Target
  const [roleEditTarget, setRoleEditTarget] = useState<{id: string, name: string, role: string} | null>(null);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  // Search, Filter, Pagination
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ search: debouncedSearch, role: roleFilter, page, limit: 10 });
      setUsers(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const handleDelete = (id: string, name: string) => setDeleteTarget({id, name});

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteUser(deleteTarget.id);
      fetchUsers(); 
      setDeleteTarget(null);
      gooeyToast.success('Pengguna berhasil dihapus');
    } catch (error: any) {
      setDeleteTarget(null);
      gooeyToast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleOpenEditRole = (user: any) => {
    if (user.role === 'ADMIN') {
      gooeyToast.error('Tidak disarankan mengubah role Admin utama saat ini dari panel ini.');
      // Optional: Remove return if you want to allow changing Admin to Student
      // return;
    }
    setRoleEditTarget({ id: user.id, name: user.fullName, role: user.role });
    setSelectedRole(user.role);
  };

  const submitRoleChange = async () => {
    if (!roleEditTarget) return;
    setIsSubmittingRole(true);
    try {
      await adminApi.updateUserRole(roleEditTarget.id, selectedRole);
      gooeyToast.success(`Role untuk ${roleEditTarget.name} berhasil diubah menjadi ${selectedRole}`);
      setRoleEditTarget(null);
      fetchUsers();
    } catch (error: any) {
      gooeyToast.error(error.response?.data?.message || 'Gagal mengubah peran pengguna');
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const userList = (users && users.length > 0) ? users : (loading ? Array.from({length: 5}).map((_, i) => ({
    id: `dummy-${i}`,
    fullName: 'Nama Pengguna Placeholder',
    email: 'email@placeholder.com',
    role: 'USER',
    semester: 1,
    createdAt: new Date().toISOString()
  })) : []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-gray-400 mt-1">Kelola data pengguna, hak akses, dan pencarian.</p>
        </div>
        <div className="bg-primary-500/10 border border-primary-500/20 text-primary-400 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.05)] backdrop-blur-md">
          <UserCog className="w-4 h-4" />
          Total: {meta.total} Pengguna
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Cari nama, username, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-[#131825] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="ALL">Semua Peran</option>
            <option value="USER">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <phantom-ui fallback-radius="16" loading={loading}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-black/40 text-gray-400 border-b border-white/10" data-shimmer-ignore>
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Role</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Semester</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Joined At</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {userList.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.07] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        data-shimmer-ignore 
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                          loading ? 'bg-white/10 text-transparent' : 
                          user.role === 'ADMIN' ? 'bg-gradient-to-br from-primary-500/20 to-purple-500/20 text-primary-400 border border-primary-500/20' : 'bg-gray-800 text-gray-300 border border-white/5'
                        }`}
                      >
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="font-medium text-gray-200 leading-none">{user.fullName}</div>
                        <div className="text-xs text-gray-500 leading-none">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Student
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="block leading-none text-gray-300">{user.semester || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="block leading-none text-gray-400">{new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditRole(user)}
                        className="p-2 rounded-xl transition-colors text-gray-400 hover:text-primary-400 hover:bg-primary-500/10"
                        title="Edit Role"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.fullName)}
                        disabled={user.role === 'ADMIN'}
                        className={`p-2 rounded-xl transition-colors ${
                          user.role === 'ADMIN'
                            ? 'text-gray-600 cursor-not-allowed opacity-50'
                            : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                        title={user.role === 'ADMIN' ? "Cannot delete admin" : "Delete User"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!loading && users.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-600" />
                      <p className="text-gray-500">Tidak ada pengguna yang ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Menampilkan Halaman <span className="text-gray-300">{meta.page}</span> dari <span className="text-gray-300">{meta.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/5"
              >
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/5"
              >
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>
        )}
        </div>
      </phantom-ui>

      {/* Edit Role Modal */}
      {roleEditTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRoleEditTarget(null)} />
          <div className="relative bg-[#131825] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Edit Role Pengguna</h3>
              <button onClick={() => setRoleEditTarget(null)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nama Pengguna</label>
                <div className="text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">{roleEditTarget.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pilih Role Baru</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-[#1A2133] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary-500/50 transition-all cursor-pointer"
                >
                  <option value="USER">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {selectedRole === 'ADMIN' && (
                  <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Perhatian: Memberikan akses Admin akan memberikan hak istimewa penuh ke panel ini.
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10 bg-black/20">
              <button 
                onClick={() => setRoleEditTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                disabled={isSubmittingRole}
              >
                Batal
              </button>
              <button 
                onClick={submitRoleChange}
                disabled={isSubmittingRole}
                className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-400 text-black rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmittingRole ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

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
