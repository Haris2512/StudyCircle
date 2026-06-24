// File ini berisi komponen untuk halaman SessionDetailPage
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, XCircle, Trash2, Video } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {
  useSessionDetailsQuery,
  useJoinSessionMutation,
  useLeaveSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} from '../hooks/useSessionsQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatDateTime, formatTime } from '../utils/formatDate';
import type { SessionStatus } from '../types';
import { gooeyToast } from 'goey-toast';

const statusConfig: Record<SessionStatus, { label: string; variant: 'info' | 'success' | 'default' | 'danger' }> = {
  scheduled: { label: 'Scheduled', variant: 'info' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>() as { sessionId: string };
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Queries
  const { data, isLoading, error: sessionError } = useSessionDetailsQuery(sessionId);

  const session = data || (isLoading ? {
    id: 'dummy',
    title: 'Judul Sesi Diskusi Placeholder',
    description: 'Deskripsi sesi diskusi yang cukup panjang agar phantom-ui dapat menampilkan baris-baris bayangan yang rapi.',
    status: 'scheduled',
    scheduledStartTime: new Date().toISOString(),
    scheduledEndTime: new Date().toISOString(),
    creator: { fullName: 'Nama Kreator' },
    studyGroup: { name: 'Nama Grup' },
    attendances: Array.from({length: 3}).map((_, i) => ({ id: `dummy-att-${i}`, user: { fullName: 'Nama Peserta Placeholder' }, status: 'active', joinedAt: new Date().toISOString() }))
  } : null);

  // Mutations
  const joinSessionMutation = useJoinSessionMutation();
  const leaveSessionMutation = useLeaveSessionMutation();
  const updateSessionMutation = useUpdateSessionMutation();
  const deleteSessionMutation = useDeleteSessionMutation();

  const statusCfg = useMemo(() => {
    if (!session) return statusConfig.scheduled;
    return statusConfig[session.status as SessionStatus] ?? statusConfig.scheduled;
  }, [session]);

  const isCreator = useMemo(() => session?.createdBy === user?.id, [session, user]);
  const now = new Date();
  const hasEnded = useMemo(() => session ? new Date(session.scheduledEndTime) < now : false, [session, now]);
  const isCancelled = useMemo(() => session?.status === 'cancelled', [session]);

  const userAttendance = useMemo(() => {
    return session?.attendances?.find(
      (a: any) => a.userId === user?.id && a.status === 'active'
    );
  }, [session, user]);

  const hasActiveAttendance = !!userAttendance;
  const canJoin = !hasActiveAttendance && !hasEnded && !isCancelled;

  const handleJoinSession = async () => {
    try {
      await joinSessionMutation.mutateAsync(sessionId);
      gooeyToast.success('Berhasil bergabung ke sesi');
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Failed to join session');
    }
  };

  const handleLeaveSession = async () => {
    try {
      await leaveSessionMutation.mutateAsync(sessionId);
      gooeyToast.success('Berhasil keluar dari sesi');
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Failed to leave session');
    }
  };

  const handleCancelSession = async () => {
    try {
      await updateSessionMutation.mutateAsync({ sessionId, payload: { status: 'cancelled' } });
      gooeyToast.success('Sesi berhasil dibatalkan');
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Failed to cancel session');
    } finally {
      setShowCancelDialog(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
      gooeyToast.success('Sesi berhasil dihapus');
      navigate(-1);
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Failed to delete session');
    } finally {
      setShowDeleteDialog(false);
    }
  };



  if (sessionError && !session) {
    return (
      <div className="text-center py-16">
        <p role="alert" className="text-red-400 mb-4">Gagal memuat sesi belajar.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <phantom-ui fallback-radius="16" loading={isLoading}>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Video Call */}
      {showVideoCall && (
        <Card className="overflow-hidden bg-[#0B0F19] h-[600px] border border-primary-500/30 shadow-[0_0_30px_rgba(203,166,247,0.15)] relative">
          <button
            onClick={() => setShowVideoCall(false)}
            className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Tutup Video Call"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={`StudyCircle-Session-${sessionId}`}
            configOverwrite={{
              startWithAudioMuted: true,
              disableModeratorIndicator: true,
              startScreenSharing: true,
              enableEmailInStats: false
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            userInfo={{
              displayName: user?.fullName || 'Student',
              email: user?.email || ''
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
            }}
          />
        </Card>
      )}

      {/* Session Info */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{session.title}</h1>
              <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            </div>
            {session.studyGroup && (
              <p className="text-sm text-gray-400">
                Group: {session.studyGroup.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {canJoin && (
              <Button onClick={handleJoinSession} loading={joinSessionMutation.isPending}>
                Join Session
              </Button>
            )}
            {hasActiveAttendance && !showVideoCall && (
              <Button variant="primary" onClick={() => setShowVideoCall(true)} className="shadow-[0_0_15px_rgba(203,166,247,0.3)]">
                <Video className="w-4 h-4 mr-2" />
                Join Virtual Room
              </Button>
            )}
            {hasActiveAttendance && (
              <Button variant="secondary" onClick={handleLeaveSession} loading={leaveSessionMutation.isPending}>
                Leave Session
              </Button>
            )}
            {isCreator && !isCancelled && (
              <Button size="sm" variant="danger" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="w-4 h-4" />
                Cancel
              </Button>
            )}
            {isCreator && (
              <Button size="sm" variant="danger" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            {formatDateTime(session.scheduledStartTime)} — {formatTime(session.scheduledEndTime)}
          </span>
        </div>

        {/* Description */}
        {session.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">Description</h3>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">{session.description}</p>
          </div>
        )}

        {/* Creator */}
        {session.creator && (
          <p className="text-xs text-gray-500">
            Created by {session.creator.fullName}
          </p>
        )}
      </Card>

      {/* Attendance List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Attendance ({session.attendances?.length ?? 0})
        </h2>

        {!session.attendances || session.attendances.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No attendees yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead data-shimmer-ignore>
                <tr className="border-b border-gray-700/50">
                  <th scope="col" className="py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined At
                  </th>
                  <th scope="col" className="py-2.5 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {session.attendances.map((att: any) => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-4 text-white font-medium">
                      {att.user?.fullName ?? 'Unknown'}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant={
                          att.status === 'active'
                            ? 'success'
                            : att.status === 'completed'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {att.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {formatDateTime(att.joinedAt)}
                    </td>
                    <td className="py-2.5 px-4 text-gray-400">
                      {att.durationMinutes != null
                        ? `${att.durationMinutes} min`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        title="Cancel Session"
        message="Are you sure you want to cancel this session? Attendees will be notified."
        confirmLabel="Cancel Session"
        variant="warning"
        onConfirm={handleCancelSession}
        onCancel={() => setShowCancelDialog(false)}
      />
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteSession}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
    </phantom-ui>
  );
}
