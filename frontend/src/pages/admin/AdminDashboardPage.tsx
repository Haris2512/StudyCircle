// File ini berisi komponen untuk halaman admin Dashboard
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Users, FolderKanban, Calendar, FileText, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchRecentUsers = async () => {
      try {
        const res = await adminApi.getUsers({ limit: 5 });
        setRecentUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch recent users', error);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchStats();
    fetchRecentUsers();
  }, []);

  const displayStats = stats || (loading ? {
    users: 120,
    groups: 15,
    sessions: 45,
    materials: 80
  } : null);

  const statCards = [
    { label: 'Total Users', value: displayStats?.users || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Study Groups', value: displayStats?.groups || 0, icon: FolderKanban, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Sessions', value: displayStats?.sessions || 0, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Materials', value: displayStats?.materials || 0, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  const userList = (recentUsers && recentUsers.length > 0) ? recentUsers : (usersLoading ? Array.from({length: 5}).map((_, i) => ({
    id: `dummy-${i}`,
    fullName: 'Placeholder User',
    email: 'email@placeholder.com',
    role: 'USER',
    createdAt: new Date().toISOString()
  })) : []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Platform statistics and metrics at a glance.</p>
      </div>

      <phantom-ui fallback-radius="16" loading={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl" aria-label={stat.label}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-gray-400 leading-none">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white leading-none">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`} data-shimmer-ignore>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
        </div>
      </phantom-ui>

      {/* Tabel Pengguna Terbaru */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Pendaftar Terbaru</h2>
          <Link to="/admin/users" className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <phantom-ui fallback-radius="16" loading={usersLoading}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-black/40 text-gray-400 border-b border-white/10" data-shimmer-ignore>
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">User</th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Joined At</th>
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
                              usersLoading ? 'bg-white/10 text-transparent' : 
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
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Student
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="block leading-none text-gray-400">{new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </td>
                    </tr>
                  ))}
                  {(!usersLoading && recentUsers.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada pengguna
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </phantom-ui>
      </div>

    </div>
  );
}
