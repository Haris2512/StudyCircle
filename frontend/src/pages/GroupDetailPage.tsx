import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, LogOut, Users, BookOpen, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSessions } from '../hooks/useSessions';
import { useMaterials } from '../hooks/useMaterials';
import { groupsApi } from '../api/groups.api';
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
import type { Group, Member } from '../types';

const TABS = [
  { key: 'sessions', label: 'Sesi Diskusi' },
  { key: 'materials', label: 'Materi Belajar' },
  { key: 'members', label: 'Anggota Grup' },
];

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sessions');

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Dialogs
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  // Hooks
  const {
    sessions,
    loading: sessionsLoading,
    fetchGroupSessions,
  } = useSessions();

  const {
    materials,
    loading: materialsLoading,
    fetchGroupMaterials,
    downloadMaterial,
    deleteMaterial,
  } = useMaterials();

  const isAdmin = members.some(
    (m) => m.userId === user?.id && m.role === 'admin'
  );
  const isMember = members.some((m) => m.userId === user?.id);

  const fetchGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setError(null);
      const [groupRes, membersRes] = await Promise.all([
        groupsApi.getGroupById(groupId),
        groupsApi.getMembers(groupId),
      ]);
      setGroup(groupRes.data);
      setMembers(membersRes.data || []);
      setEditName(groupRes.data.name);
      setEditDesc(groupRes.data.description ?? '');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat grup');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  useEffect(() => {
    if (!groupId) return;
    if (activeTab === 'sessions') fetchGroupSessions(groupId);
    if (activeTab === 'materials') fetchGroupMaterials(groupId);
  }, [groupId, activeTab]);

  const handleSaveEdit = async () => {
    if (!groupId) return;
    try {
      setSaving(true);
      await groupsApi.updateGroup(groupId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      });
      await fetchGroup();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memperbarui grup');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupId) return;
    try {
      await groupsApi.deleteGroup(groupId);
      navigate('/groups', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menghapus grup');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    try {
      await groupsApi.leaveGroup(groupId);
      navigate('/groups', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal keluar dari grup');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!groupId) return;
    try {
      await groupsApi.removeMember(groupId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengeluarkan anggota');
    }
  };

  const handleDeleteMaterial = async () => {
    if (!groupId || !materialToDelete) return;
    try {
      await deleteMaterial(materialToDelete);
      await fetchGroupMaterials(groupId);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menghapus materi');
    } finally {
      setMaterialToDelete(null);
    }
  };

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
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
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
                    onDelete={() => setMaterialToDelete(material.id)}
                  />
                ))}
              </div>
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
            onCreated={() => fetchGroupSessions(groupId)}
          />
          <UploadMaterialModal
            isOpen={showUploadMaterial}
            onClose={() => setShowUploadMaterial(false)}
            groupId={groupId}
            onUploaded={() => fetchGroupMaterials(groupId)}
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
