// File ini berisi komponen untuk halaman MyGroupsPage
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGroupsInfiniteQuery } from '../hooks/useGroupsQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { GroupCard } from '../components/features/groups/GroupCard';

export function MyGroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch groups using React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGroupsInfiniteQuery({ limit: 50 });

  // Flatten the paginated groups data
  const groups = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const isMember = (group: any) => {
    if (!user) return false;
    return (
      group.members?.some((m: any) => m.userId === user.id) ||
      group.createdBy === user.id
    );
  };

  const myGroups = useMemo(() => {
    return groups.filter(isMember);
  }, [groups, user]);

  const displayGroups = isLoading 
    ? Array.from({ length: 8 }).map((_, i) => ({
        id: `dummy-${i}`,
        name: 'Nama Kelompok Placeholder',
        description: 'Deskripsi kelompok belajar yang sengaja dibuat cukup panjang agar phantom-ui dapat mengukur dimensinya.',
        maxMembers: 10,
        _count: { members: 0 },
      }))
    : myGroups;

  return (
    <phantom-ui fallback-radius="16" loading={isLoading}>
      <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Grup Saya</h1>
          <p className="text-gray-400 text-sm mt-1">Daftar grup belajar yang telah Anda ikuti.</p>
        </div>
        <Button onClick={() => navigate('/groups')}>
          <Search className="w-4 h-4 mr-2" />
          Cari Grup Lain
        </Button>
      </div>

      {/* Groups Grid */}
      {!isLoading && myGroups.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Belum ada grup"
          description="Eksplorasi dan bergabunglah dengan grup belajar yang sesuai dengan minat Anda."
          action={
            <Button onClick={() => navigate('/groups')}>
              <Search className="w-4 h-4 mr-2" />
              Eksplorasi Grup
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayGroups.map((group) => {
              const admin = group.createdBy === user?.id || false;
              const member = group.members?.some((m: any) => m.userId === user?.id) || false;
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={member}
                  isAdmin={admin}
                  onClick={() => navigate(`/groups/${group.id}`)}
                />
              );
            })}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                loading={isFetchingNextPage}
              >
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
    </phantom-ui>
  );
}
