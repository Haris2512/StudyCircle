// Komponen ini merupakan bagian dari antarmuka pengguna
import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { CompatibilityBadge } from '../../common/CompatibilityBadge';
import type { RecommendedGroup } from '../../../types/recommendations';

interface RecommendedGroupCardProps {
  group: RecommendedGroup;
  onJoin: (groupId: string) => Promise<void>;
}

export const RecommendedGroupCard: React.FC<RecommendedGroupCardProps> = ({ group, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await onJoin(group.id);
    } finally {
      setIsJoining(false);
    }
  };

  const isFull = group._count && group._count.members >= group.maxMembers;

  return (
    <Card hoverable className="flex flex-col h-full bg-gradient-to-br from-[#0B0F19]/80 to-indigo-900/10 border-indigo-500/20">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white line-clamp-1 text-left">
              {group.name}
            </h3>
            {group.subject && (
              <div className="mt-2">
                <Badge variant="info">{group.subject.name}</Badge>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <CompatibilityBadge score={group.compatibilityScore} size="sm" />
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4 text-left">
          {group.description || 'No description provided.'}
        </p>

        {group.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 text-left">
            {group.matchReasons.map((reason, idx) => (
              <span key={idx} className="text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <span className="font-semibold text-gray-200">
            {group._count?.members || 0}
          </span>
          <span className="mx-1">/</span>
          {group.maxMembers} members
        </div>
        <Button
          onClick={handleJoin}
          disabled={isFull || isJoining}
          loading={isJoining}
          className="shadow-lg shadow-indigo-500/20"
        >
          {isFull ? 'Full' : 'Join Group'}
        </Button>
      </div>
    </Card>
  );
};
