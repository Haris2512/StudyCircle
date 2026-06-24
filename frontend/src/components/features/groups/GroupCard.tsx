// Komponen ini merupakan bagian dari antarmuka pengguna
import { Users, BookOpen } from 'lucide-react';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import type { Group } from '../../../types';

interface GroupCardProps {
  group: Group;
  isMember?: boolean;
  isAdmin?: boolean;
  onJoin?: () => void;
  onClick: () => void;
}

export function GroupCard({ group, isMember, isAdmin, onJoin, onClick }: GroupCardProps) {
  const memberCount = group._count?.members ?? 0;
  const maxMembers = group.maxMembers;
  const isFull = memberCount >= maxMembers;
  const slotsLeft = maxMembers - memberCount;

  return (
    <Card hoverable onClick={onClick} className="p-5 flex flex-col h-full group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div data-shimmer-ignore className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary-500/50 group-hover:shadow-[0_0_15px_rgba(203,166,247,0.3)] group-hover:-translate-y-1 transition-all duration-300">
          <BookOpen className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
        </div>
        
        {isAdmin ? (
          <Badge variant="primary" className="shadow-[0_0_10px_rgba(203,166,247,0.3)]">Admin</Badge>
        ) : isMember ? (
          <Badge variant="success">Member</Badge>
        ) : isFull ? (
          <Badge variant="danger">Penuh</Badge>
        ) : (
          <Badge variant="outline-warning">Sisa {slotsLeft} slot</Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-grow">
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors duration-300 line-clamp-1 relative z-10">
          {group.name}
          {(group as any).matchScore !== undefined && (
            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
              {(group as any).matchScore}% Cocok
            </span>
          )}
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
            if (isMember || isAdmin || isFull) {
              onClick();
            } else if (onJoin) {
              onJoin();
            }
          }}
        >
          {isAdmin || isMember ? 'Lihat Detail' : isFull ? 'Grup Penuh' : 'Bergabung'}
        </Button>
      </div>
    </Card>
  );
}
