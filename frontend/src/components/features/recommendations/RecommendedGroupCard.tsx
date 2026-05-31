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
    <Card className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-200 border-indigo-100 dark:border-indigo-900/50">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 text-left">
              {group.name}
            </h3>
            {group.subject && (
              <div className="mt-1">
                <Badge variant="info">{group.subject.name}</Badge>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 ml-2">
            <CompatibilityBadge score={group.compatibilityScore} size="sm" />
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 text-left">
          {group.description || 'No description provided.'}
        </p>

        {group.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 text-left">
            {group.matchReasons.map((reason, idx) => (
              <span key={idx} className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                ✓ {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {group._count?.members || 0}
          </span>
          <span className="mx-1">/</span>
          {group.maxMembers} members
        </div>
        <Button
          onClick={handleJoin}
          disabled={isFull || isJoining}
          loading={isJoining}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isFull ? 'Full' : 'Join Group'}
        </Button>
      </div>
    </Card>
  );
};
