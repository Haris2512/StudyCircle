import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { Tabs } from '../components/common/Tabs';
import { GroupCard } from '../components/features/groups/GroupCard';
import { CreateGroupModal } from '../components/features/groups/CreateGroupModal';

export function GroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, loading, joinGroup, refetch } = useGroups();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_joiningId, setJoiningId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'my_groups', label: 'Grup Saya' },
    { key: 'available', label: 'Tersedia' },
  ];

  const isMember = (group: typeof groups[0]) => {
    if (!user) return false;
    return (
      group.members?.some((m) => m.userId === user.id) ||
      group.createdBy === user.id
    );
  };

  const filteredGroups = useMemo(() => {
    let result = groups;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description?.toLowerCase().includes(q)
      );
    }

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
  }, [groups, activeTab, searchQuery, user]);

  const handleJoin = async (groupId: string) => {
    try {
      setJoiningId(groupId);
      setJoinError(null);
      await joinGroup(groupId);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) {
        setJoinError('Anda sudah menjadi anggota grup ini.');
      } else {
        setJoinError(err.response?.data?.error || 'Gagal bergabung dengan grup');
      }
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Grup Belajar</h1>
          <p className="text-gray-400 text-sm mt-1">Temukan dan bergabung dengan grup yang sesuai.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Grup Baru
        </Button>
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

      {/* Join Error Toast */}
      {joinError && (
        <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{joinError}</span>
          <button
            onClick={() => setJoinError(null)}
            className="text-red-400 hover:text-red-300 ml-3"
            aria-label="Tutup peringatan"
          >
            ✕
          </button>
        </div>
      )}

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title={searchQuery ? 'Grup tidak ditemukan' : 'Belum ada grup'}
          description={
            searchQuery
              ? 'Coba gunakan kata kunci pencarian yang lain.'
              : 'Jadilah yang pertama membuat grup belajar!'
          }
          action={
            !searchQuery ? (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Grup
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isMember={isMember(group)}
              onJoin={() => handleJoin(group.id)}
              onClick={() => navigate(`/groups/${group.id}`)}
            />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={refetch}
      />
    </div>
  );
}
