import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { useGroupsInfiniteQuery, useJoinGroupMutation } from '../hooks/useGroupsQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { Tabs } from '../components/common/Tabs';
import { GroupCard } from '../components/features/groups/GroupCard';
import { Badge } from '../components/common/Badge';
import { gooeyToast } from 'goey-toast';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch groups using React Query
  const { data, isLoading } = useGroupsInfiniteQuery({ search: debouncedSearchQuery, limit: 6 });
  const joinMutation = useJoinGroupMutation();

  const groups = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const tabs = [
    { key: 'all', label: 'Semua' },
    { key: 'available', label: 'Tersedia' },
    { key: 'full', label: 'Penuh' },
    { key: 'my_major', label: 'Jurusan Saya' },
  ];

  const filteredGroups = useMemo(() => {
    let result = groups;

    switch (activeTab) {
      case 'available':
        result = result.filter(g => (g._count?.members ?? 0) < g.maxMembers);
        break;
      case 'full':
        result = result.filter(g => (g._count?.members ?? 0) >= g.maxMembers);
        break;
      case 'my_major':
        // Assuming user.major exists, otherwise fallback
        break;
      default:
        break;
    }

    return result;
  }, [groups, activeTab]);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  // Identify "My Groups" based on membership
  const myGroups = groups.filter(g => g.members?.some((m: any) => m.userId === user?.id));
  const upcomingSessionGroup = myGroups[0] || groups[0]; // mock upcoming session

  return (
    <div className="space-y-10 pb-12 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-3 text-gradient-animated">
          Selamat Datang, {user?.fullName?.split(' ')[0] ?? 'Mahasiswa'}!
        </h1>
        <p className="text-gray-400 text-lg flex items-center gap-2">
          Siap untuk sesi belajar hari ini? 🚀
        </p>
      </div>

      {/* Sesi Terdekat Hero Card */}
      <section aria-label="Sesi terdekat">
        <h2 className="text-xl font-bold text-white mb-4">Sesi Terdekat</h2>
        {upcomingSessionGroup ? (
          <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group hover:shadow-[0_8px_32px_0_rgba(203,166,247,0.2)] transition-shadow duration-500">
            {/* Holographic background elements */}
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700" />
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-secondary-500/10 rounded-full blur-[60px] -translate-x-1/2 translate-y-1/2 pointer-events-none group-hover:bg-secondary-500/20 transition-colors duration-700" />
            
            <div className="flex items-start gap-5 z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary-500/30 transition-colors duration-500">
                <span className="text-3xl">{'{}'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="solid-warning" className="w-fit">JADWAL Hari ini, 14:00 WITA</Badge>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {upcomingSessionGroup.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {upcomingSessionGroup._count?.members ?? 0} Peserta Hadir
                </p>
              </div>
            </div>

            <Button size="lg" className="shrink-0 z-10 w-full md:w-auto" onClick={() => navigate(`/groups/${upcomingSessionGroup.id}`)}>
              Masuk Sesi <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : (
          <EmptyState
            title="Tidak ada sesi terdekat"
            description="Anda belum memiliki jadwal belajar dalam waktu dekat."
          />
        )}
      </section>

      {/* Temukan Grup Baru Section */}
      <section aria-label="Temukan grup baru" className="animate-fade-in-up animate-delay-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">Temukan Grup Baru</h2>
          
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

        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          className="mb-6"
        />

        {filteredGroups.length === 0 ? (
          <EmptyState
            title="Grup tidak ditemukan"
            description="Coba cari dengan kata kunci lain atau pilih kategori yang berbeda."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredGroups.map((group) => {
              const isMember = group.members?.some((m: any) => m.userId === user?.id);
              const isAdmin = group.createdBy === user?.id;
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={isMember}
                  isAdmin={isAdmin}
                  onJoin={async () => {
                    try {
                      await joinMutation.mutateAsync(group.id);
                      gooeyToast.success('Berhasil bergabung dengan grup');
                      navigate(`/groups/${group.id}`);
                    } catch (err: any) {
                      gooeyToast.error(err.response?.data?.message || 'Gagal bergabung dengan grup');
                    }
                  }}
                  onClick={() => navigate(`/groups/${group.id}`)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
