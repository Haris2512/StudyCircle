// Komponen ini merupakan bagian dari antarmuka pengguna
import { Clock } from 'lucide-react';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { formatDateTime, formatTime } from '../../../utils/formatDate';
import type { Session, SessionStatus } from '../../../types';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

const statusConfig: Record<SessionStatus, { label: string; variant: 'info' | 'success' | 'default' | 'danger' }> = {
  scheduled: { label: 'Scheduled', variant: 'info' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

export function SessionCard({ session, onClick }: SessionCardProps) {
  const config = statusConfig[session.status] ?? statusConfig.scheduled;

  return (
    <Card hoverable onClick={onClick} className="p-5">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white truncate">
            {session.title}
          </h3>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            {formatDateTime(session.scheduledStartTime)} — {formatTime(session.scheduledEndTime)}
          </span>
        </div>

        {/* Attendances count */}
        {session.attendances && (
          <p className="text-xs text-gray-500">
            {session.attendances.length} attendee{session.attendances.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Card>
  );
}
