import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, LogOut, Users, BookOpen, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGroupDetailQuery, useGroupMembersQuery, useLeaveGroupMutation, useRemoveMemberMutation } from '../hooks/useGroupsQuery';
import { useGroupSessionsQuery } from '../hooks/useSessionsQuery';
import { useMaterialsInfiniteQuery, useDeleteMaterialMutation } from '../hooks/useMaterialsQuery';
import { groupsApi } from '../api/groups.api';
import { materialsApi } from '../api/materials.api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Tabs } from '../components/common/Tabs';
import { FormInput } from '../components/common/FormInput';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SessionCard } from '../components/features/sessions/SessionCard';
import { CreateSessionModal } from '../components/features/sessions/CreateSessionModal';
import { MaterialCard } from '../components/features/materials/MaterialCard';
import { UploadMaterialModal } from '../components/features/materials/UploadMaterialModal';
import { MemberList } from '../components/features/groups/MemberList';
import { GroupChat } from '../components/features/groups/GroupChat';
import { useQueryClient } from '@tanstack/react-query';
import { socketService } from '../utils/socket';

const TABS = [
  { key: 'chat', label: 'Chat Grup' },
  { key: 'sessions', label: 'Sesi Diskusi' },
  { key: 'materials', label: 'Materi Belajar' },
  { key: 'members', label: 'Anggota Grup' },
];

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>() as { groupId: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('chat');

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  // React Query Queries
  const { data: groupDetail, isLoading: detailLoading } = useGroupDetailQuery(groupId);
  const { data: membersDetail, isLoading: membersLoading } = useGroupMembersQuery(groupId);
  const { data: sessionsDetail, isLoading: sessionsLoading } = useGroupSessionsQuery(groupId);
  
  // Materials Query with Pagination
  const {
    data: materialsData,
    isLoading: materialsLoading,
    fetchNextPage: fetchNextMaterialsPage,
    hasNextPage: hasNextMaterialsPage,
    isFetchingNextPage: isFetchingNextMaterialsPage,
  } = useMaterialsInfiniteQuery(groupId, 10);

  // Mutations
  const leaveGroupMutation = useLeaveGroupMutation();
  const removeMemberMutation = useRemoveMemberMutation();
  const deleteMaterialMutation = useDeleteMaterialMutation();

  const group = groupDetail?.data;
  const members = membersDetail?.data || [];
  const sessions = sessionsDetail?.data || [];

  const materials = useMemo(() => {
    return materialsData?.pages.flatMap((page) => page.data) ?? [];
  }, [materialsData]);

  // Set form fields once data loads
  useEffect(() => {
    if (group) {
      setEditName(group.name);
      setEditDesc(group.description ?? '');
    }
  }, [group]);

  // Handle Real-Time Notifications
  useEffect(() => {
    if (!groupId) return;

    socketService.connect();
    socketService.joinGroup(groupId);

    // Listen to generic notifications from socket
    socketService.getSocket()?.on('material_uploaded', (data: any) => {
      // Refresh materials query
      queryClient.invalidateQueries({ queryKey: ['materials', 'infinite', groupId] });
    });

    return () => {
      socketService.getSocket()?.off('material_uploaded');
    };
  }, [groupId, queryClient]);

  const isAdmin = useMemo(() => {
    return members.some((m: any) => m.userId === user?.id && m.role === 'admin');
  }, [members, user]);

  const isMember = useMemo(() => {
    return members.some((m: any) => m.userId === user?.id);
  }, [members, user]);

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setError(null);
      await groupsApi.updateGroup(groupId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', groupId] });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memperbarui grup');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await groupsApi.deleteGroup(groupId);
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      navigate('/groups', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menghapus grup');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupMutation.mutateAsync(groupId);
      navigate('/groups', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal keluar dari grup');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberMutation.mutateAsync({ groupId, userId });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengeluarkan anggota');
    }
  };

  const handleDeleteMaterial = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMaterialMutation.mutateAsync({ groupId, materialId: materialToDelete });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menghapus materi');
    } finally {
      setMaterialToDelete(null);
    }
  };

  const downloadMaterial = async (materialId: string) => {
    try {
      const response = await materialsApi.downloadMaterial(materialId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error', err);
    }
  };

  const viewMaterial = (materialId: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    window.open(`${baseUrl}/materials/${materialId}/download?view=true`, '_blank');
  };

  const loading = detailLoading || membersLoading;

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error && !group) {
    return (
      <div className="text-center py-16">
        <p role="alert" className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => navigate('/groups')}>Kembali ke Grup</Button>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => navigate('/groups')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Kembali ke daftar grup"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Grup
      </button>

      {/* Header */}
      <Card className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <FormInput
              label="Nama Grup"
              name="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="desc" className="text-sm font-medium text-gray-300">
                Deskripsi
              </label>
              <textarea
                id="desc"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-dark-bg text-white placeholder-gray-500 border border-dark-border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveEdit} loading={saving}>
                Simpan
              </Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <BookOpen className="w-8 h-8 text-primary-400" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">{group.name}</h1>
                  {group.description && (
                    <p className="text-sm text-gray-400">{group.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
                    {group.subject && (
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        {group.subject.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {members.length}/{group.maxMembers} Anggota
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                {isAdmin && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Ubah
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Hapus
                    </Button>
                  </>
                )}
                {isMember && !isAdmin && (
                  <Button size="sm" variant="danger" onClick={handleLeaveGroup}>
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Keluar Grup
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg">{error}</p>
      )}

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {!user ? (
              <EmptyState
                icon={<LogOut className="w-12 h-12" />}
                title="Login Diperlukan"
                description="Anda harus login untuk melihat jadwal sesi diskusi grup ini."
                action={<Button onClick={() => navigate('/login')}>Login untuk Bergabung</Button>}
              />
            ) : (
              <>
                {isAdmin && (
                  <div className="flex justify-end">
                    <Button size="sm" onClick={() => setShowCreateSession(true)}>
                      <Plus className="w-4 h-4 mr-1.5" />
                      Buat Jadwal Diskusi
                    </Button>
                  </div>
                )}
                {sessionsLoading ? (
                  <LoadingSpinner className="py-12" />
                ) : sessions.length === 0 ? (
                  <EmptyState
                    icon={<Calendar className="w-10 h-10" />}
                    title="Belum ada sesi diskusi"
                    description="Jadwalkan sesi belajar pertama untuk grup ini."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {sessions.map((session: any) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onClick={() => navigate(`/sessions/${session.id}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && groupId && (
          !user ? (
            <EmptyState
              icon={<LogOut className="w-12 h-12" />}
              title="Login Diperlukan"
              description="Anda harus login untuk melihat dan mengirim pesan di grup ini."
              action={<Button onClick={() => navigate('/login')}>Login untuk Bergabung</Button>}
            />
          ) : (
            <GroupChat groupId={groupId} />
          )
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {!user ? (
              <EmptyState
                icon={<LogOut className="w-12 h-12" />}
                title="Login Diperlukan"
                description="Anda harus login untuk melihat dan mengunduh materi grup ini."
                action={<Button onClick={() => navigate('/login')}>Login untuk Bergabung</Button>}
              />
            ) : (
              <>
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setShowUploadMaterial(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Unggah Materi
                  </Button>
                </div>
                {materialsLoading ? (
                  <LoadingSpinner className="py-12" />
                ) : materials.length === 0 ? (
                  <EmptyState
                    title="Belum ada materi"
                    description="Unggah materi belajar untuk grup ini."
                  />
                ) : (
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                        canDelete={isAdmin || material.uploaderId === user?.id}
                        onDownload={() => downloadMaterial(material.id)}
                        onView={() => viewMaterial(material.id)}
                        onDelete={() => setMaterialToDelete(material.id)}
                      />
                    ))}

                    {/* Load More Materials */}
                    {hasNextMaterialsPage && (
                      <div className="flex justify-center pt-4">
                        <Button
                          variant="secondary"
                          onClick={() => fetchNextMaterialsPage()}
                          disabled={isFetchingNextMaterialsPage}
                          loading={isFetchingNextMaterialsPage}
                        >
                          Muat Lebih Banyak Materi
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <MemberList
            members={members}
            isAdmin={isAdmin}
            currentUserId={user?.id ?? ''}
            onRemove={handleRemoveMember}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      {groupId && (
        <>
          <CreateSessionModal
            isOpen={showCreateSession}
            onClose={() => setShowCreateSession(false)}
            groupId={groupId}
          />
          <UploadMaterialModal
            isOpen={showUploadMaterial}
            onClose={() => setShowUploadMaterial(false)}
            groupId={groupId}
          />
        </>
      )}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus Grup"
        message="Apakah Anda yakin ingin menghapus grup ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={handleDeleteGroup}
        onCancel={() => setShowDeleteDialog(false)}
      />
      <ConfirmDialog
        isOpen={!!materialToDelete}
        title="Hapus Materi"
        message="Apakah Anda yakin ingin menghapus materi ini? File dan data materi akan hilang secara permanen."
        confirmLabel="Hapus Materi"
        variant="danger"
        onConfirm={handleDeleteMaterial}
        onCancel={() => setMaterialToDelete(null)}
      />
    </div>
  );
}
