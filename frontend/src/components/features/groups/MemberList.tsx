import { Trash2 } from 'lucide-react';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { formatDate } from '../../../utils/formatDate';
import type { Member } from '../../../types';

interface MemberListProps {
  members: Member[];
  isAdmin: boolean;
  currentUserId: string;
  onRemove: (userId: string) => void;
}

export function MemberList({ members, isAdmin, currentUserId, onRemove }: MemberListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th scope="col" className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Username
            </th>
            <th scope="col" className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Joined
            </th>
            {isAdmin && (
              <th scope="col" className="py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-white/5 transition-colors">
              <td className="py-3 px-4 text-white font-medium">
                {member.user.fullName}
              </td>
              <td className="py-3 px-4 text-gray-400">
                @{member.user.username}
              </td>
              <td className="py-3 px-4">
                <Badge variant={member.role === 'admin' ? 'warning' : 'default'}>
                  {member.role === 'admin' ? 'Admin' : 'Member'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-gray-400">
                {formatDate(member.joinedAt)}
              </td>
              {isAdmin && (
                <td className="py-3 px-4 text-right">
                  {member.role !== 'admin' && member.userId !== currentUserId && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onRemove(member.userId)}
                      aria-label={`Keluarkan ${member.user.fullName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {members.length === 0 && (
        <p className="text-center text-gray-500 py-8 text-sm">
          No members found.
        </p>
      )}
    </div>
  );
}
