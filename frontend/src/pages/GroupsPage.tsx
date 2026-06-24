// File ini berisi komponen untuk halaman GroupsPage
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { useGroupsInfiniteQuery, useJoinGroupMutation, useRecommendationsQuery } from '../hooks/useGroupsQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { Tabs } from '../components/common/Tabs';
import { GroupCard } from '../components/features/groups/GroupCard';
import { CreateGroupModal } from '../components/features/groups/CreateGroupModal';
import { gooeyToast } from 'goey-toast';

export function GroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // React Query Infinite Scroll Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGroupsInfiniteQuery({ search: debouncedSearchQuery, limit: 12 });

  const joinMutation = useJoinGroupMutation();

  const { data: recommendationsData, isLoading: isRecLoading } = useRecommendationsQuery();

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'recommended', label: 'Rekomendasi' },
    { key: 'my_groups', label: 'Grup Saya' },
    { key: 'available', label: 'Tersedia' },
  ];

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

  const filteredGroups = useMemo(() => {
    if (activeTab === 'recommended') {
      return recommendationsData?.data ?? [];
    }

    let result = groups;

    switch (activeTab) {
      case 'my_groups':
        result = result.filter(g => isMember(g));
        break;
      case 'available':
        result = result.filter(g => !isMember(g) && (g._count?.members ?? 0) < g.maxMembers);
        break;
      default:
        break;
    }

    return result;
  }, [groups, activeTab, user, recommendationsData]);

  const handleJoin = async (groupId: string) => {
    try {
      await joinMutation.mutateAsync(groupId);
      gooeyToast.success('Berhasil bergabung dengan grup');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) {
        gooeyToast.error('Anda sudah menjadi anggota grup ini.');
      } else {
        gooeyToast.error(err.response?.data?.error || 'Gagal bergabung dengan grup');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Grup Belajar</h1>
          <p className="text-gray-400 text-sm mt-1">Temukan dan bergabung dengan grup yang sesuai.</p>
        </div>
        {user && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Grup Baru
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="w-full md:w-64">
          <FormInput
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari grup..."
            leadingIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Groups Grid */}
      <phantom-ui fallback-radius="16" loading={isLoading}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <GroupCard
                key={i}
                group={{
                  id: `dummy-${i}`,
                  name: 'Nama Kelompok Placeholder',
                  description: 'Deskripsi kelompok belajar yang sengaja dibuat cukup panjang agar phantom-ui dapat mengukur dimensinya dengan akurat menjadi dua atau tiga baris teks.',
                  tags: ['Placeholder', 'Topik'],
                  maxMembers: 10,
                  _count: { members: 0 },
                }}
                isMember={false}
                isAdmin={false}
                onJoin={() => {}}
                onClick={() => {}}
              />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title={searchQuery ? 'Grup tidak ditemukan' : 'Belum ada grup'}
            description={
              searchQuery
                ? 'Coba gunakan kata kunci pencarian yang lain.'
                : 'Jadilah yang pertama membuat grup belajar!'
            }
          action={
            !searchQuery && user ? (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Grup
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGroups.map((group) => {
              const admin = group.createdBy === user?.id;
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={isMember(group)}
                  isAdmin={admin}
                  onJoin={() => handleJoin(group.id)}
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
      </phantom-ui>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
