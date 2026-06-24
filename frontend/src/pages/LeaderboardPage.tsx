// File ini berisi komponen untuk halaman LeaderboardPage
import { Trophy, Medal, Star } from 'lucide-react';
import { useLeaderboardQuery } from '../hooks/useProfileQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Card } from '../components/common/Card';

export function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboardQuery(20);

  const leaderboardList = leaderboard || (isLoading ? Array.from({ length: 5 }).map((_, i) => ({
    id: `dummy-${i}`,
    fullName: 'Nama Pengguna Placeholder',
    username: 'username_placeholder',
    level: 10,
    points: 1000
  })) : []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]" />;
    return <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>;
  };

  const getBadgeName = (level: number) => {
    if (level < 5) return 'Pemula';
    if (level < 10) return 'Pelajar Aktif';
    if (level < 20) return 'Sarjana';
    return 'Master';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
          Papan Peringkat
        </h1>
        <p className="text-gray-400">Peringkat 20 Teratas Anggota StudyCircle</p>
      </div>

      <phantom-ui fallback-radius="16" loading={isLoading}>
        <Card className="p-0 overflow-hidden max-w-4xl mx-auto border-gray-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead data-shimmer-ignore>
              <tr className="bg-white/5 border-b border-gray-800">
                <th className="py-4 px-6 font-semibold text-gray-400">Peringkat</th>
                <th className="py-4 px-6 font-semibold text-gray-400">Pengguna</th>
                <th className="py-4 px-6 font-semibold text-gray-400">Level & Badge</th>
                <th className="py-4 px-6 font-semibold text-gray-400 text-right">Total Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {leaderboardList.map((user: any, index: number) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6 flex items-center justify-center w-16">
                    {getRankIcon(index)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-semibold text-white leading-none">{user.fullName}</span>
                      <span className="text-xs text-gray-500 leading-none">@{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/20 text-xs font-bold whitespace-nowrap">
                        Lv. {user.level}
                      </span>
                      <span className="text-xs text-gray-400">
                        {getBadgeName(user.level)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 font-bold text-white">
                      {user.points.toLocaleString()}
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    </div>
                  </td>
                </tr>
              ))}
              
              {(!isLoading && (!leaderboardList || leaderboardList.length === 0)) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Belum ada data peringkat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      </phantom-ui>
    </div>
  );
}
