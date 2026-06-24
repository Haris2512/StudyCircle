// Komponen ini merupakan bagian dari antarmuka pengguna
import { Clock, BookOpen, Calendar } from 'lucide-react';
import { Card } from '../../common/Card';
import { MasteryBadge } from './MasteryBadge';
import { formatRelativeTime } from '../../../utils/formatDate';
import type { Progress } from '../../../types';

interface ProgressCardProps {
  progress: Progress;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-white">
            {progress.subjectName}
          </h3>
          <MasteryBadge level={progress.masteryLevel} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{progress.totalStudyHours.toFixed(1)} hours</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{progress.sessionsAttended} sessions</span>
          </div>
        </div>

        {/* Last studied */}
        {progress.lastStudiedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Last studied {formatRelativeTime(progress.lastStudiedAt)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
