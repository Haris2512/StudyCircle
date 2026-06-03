import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { sessionsApi } from '../api/sessions.api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatDateTime, formatTime } from '../utils/formatDate';
import type { Session, SessionStatus } from '../types';

const statusConfig: Record<SessionStatus, { label: string; variant: 'info' | 'success' | 'default' | 'danger' }> = {
  scheduled: { label: 'Scheduled', variant: 'info' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await sessionsApi.getSessionDetails(sessionId);
      setSession(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (error && !session) {
    return (
      <div className="text-center py-16">
        <p role="alert" className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!session) return null;

  const statusCfg = statusConfig[session.status] ?? statusConfig.scheduled;
  const isCreator = session.createdBy === user?.id;
  const now = new Date();
  const hasEnded = new Date(session.scheduledEndTime) < now;
  const isCancelled = session.status === 'cancelled';

  const userAttendance = session.attendances?.find(
    (a) => a.userId === user?.id && a.status === 'active'
  );
  const hasActiveAttendance = !!userAttendance;
  const canJoin = !hasActiveAttendance && !hasEnded && !isCancelled;

  const handleJoinSession = async () => {
    if (!sessionId) return;
    try {
      setActionLoading(true);
      await sessionsApi.joinSession(sessionId);
      await fetchSession();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveSession = async () => {
    if (!sessionId) return;
    try {
      setActionLoading(true);
      await sessionsApi.leaveSession(sessionId);
      await fetchSession();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to leave session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!sessionId) return;
    try {
      await sessionsApi.updateSession(sessionId, { status: 'cancelled' });
      await fetchSession();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel session');
    } finally {
      setShowCancelDialog(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionId) return;
    try {
      await sessionsApi.deleteSession(sessionId);
      navigate(-1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete session');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

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
              <Button onClick={handleJoinSession} loading={actionLoading}>
                Join Session
              </Button>
            )}
            {hasActiveAttendance && (
              <Button variant="secondary" onClick={handleLeaveSession} loading={actionLoading}>
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

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-lg">{error}</p>
      )}

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
              <thead>
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
                {session.attendances.map((att) => (
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
  );
}
