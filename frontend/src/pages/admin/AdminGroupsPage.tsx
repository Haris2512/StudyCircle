// File ini berisi komponen untuk halaman admin Groups
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Trash2, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { gooeyToast } from 'goey-toast';
import { useDebounce } from '../../hooks/useDebounce';

export function AdminGroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{id: string, name: string} | null>(null);

  // Search & Pagination
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGroups({ search: debouncedSearch, page, limit: 10 });
      setGroups(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (error) {
      console.error('Failed to load groups', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = (id: string, name: string) => setDeleteTarget({id, name});

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteGroup(deleteTarget.id);
      fetchGroups(); // Refresh to get correct pagination
      setDeleteTarget(null);
      gooeyToast.success('Grup berhasil dihapus');
    } catch (error: any) {
      setDeleteTarget(null);
      gooeyToast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  const groupList = (groups && groups.length > 0) ? groups : (loading ? Array.from({length: 5}).map((_, i) => ({
    id: `dummy-${i}`,
    name: 'Nama Kelompok Placeholder',
    subject: { code: 'SUB101' },
    creator: { fullName: 'Nama Kreator' },
    _count: { members: 0 },
    maxMembers: 10
  })) : []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Groups</h1>
          <p className="text-gray-400 mt-1">Kelola kelompok studi dan mata kuliah.</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.05)] backdrop-blur-md">
          <Users className="w-4 h-4" />
          Total: {meta.total} Grup
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Cari nama grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
      </div>

      <phantom-ui fallback-radius="16" loading={loading}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-black/40 text-gray-400 border-b border-white/10" data-shimmer-ignore>
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Group Name</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Creator</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Members</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {groupList.map(group => (
                <tr key={group.id} className="hover:bg-white/[0.07] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-200 leading-none">{group.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-xs text-gray-300 font-medium">
                      {group.subject?.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="block leading-none text-gray-300">{group.creator?.fullName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Users className="w-3 h-3" /> {group._count?.members}/{group.maxMembers}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(group.id, group.name)}
                      className="p-2 rounded-xl transition-colors text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!loading && groups.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-600" />
                      <p className="text-gray-500">Tidak ada grup yang ditemukan</p>
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
