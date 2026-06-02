import { Users, BookOpen } from 'lucide-react';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import type { Group } from '../../../types';

interface GroupCardProps {
  group: Group;
  isMember?: boolean;
  onJoin?: () => void;
  onClick: () => void;
}

export function GroupCard({ group, isMember, onJoin, onClick }: GroupCardProps) {
  const memberCount = group._count?.members ?? 0;
  const maxMembers = group.maxMembers;
  const isFull = memberCount >= maxMembers;
  const slotsLeft = maxMembers - memberCount;

  return (
    <Card hoverable onClick={onClick} className="p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
          <BookOpen className="w-5 h-5 text-gray-300" />
        </div>
        
        {isMember ? (
          <Badge variant="success">Grup Saya</Badge>
        ) : isFull ? (
          <Badge variant="danger">Penuh</Badge>
        ) : (
          <Badge variant="outline-warning">Sisa {slotsLeft} slot</Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-grow">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {group.description}
          </p>
        )}
      </div>

      {/* Footer info */}
      <div className="flex flex-col gap-2 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {memberCount}/{maxMembers} Anggota
        </div>
        <div className="flex items-center gap-2">
          {'Jadwal belum ditentukan'}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-4 border-t border-dark-border">
        <Button
          variant="outline"
          className="w-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            if (isMember || isFull) {
              onClick();
            } else if (onJoin) {
              onJoin();
            }
          }}
        >
          {isMember ? 'Lihat Detail' : isFull ? 'Grup Penuh' : 'Bergabung'}
        </Button>
      </div>
    </Card>
  );
}
