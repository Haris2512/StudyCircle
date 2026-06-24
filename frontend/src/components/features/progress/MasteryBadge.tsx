// Komponen ini merupakan bagian dari antarmuka pengguna
import { Badge } from '../../common/Badge';
import type { MasteryLevel } from '../../../types';

interface MasteryBadgeProps {
  level: MasteryLevel;
}

const masteryConfig: Record<MasteryLevel, { label: string; variant: 'default' | 'warning' | 'success' }> = {
  BEGINNER: { label: 'Beginner', variant: 'default' },
  INTERMEDIATE: { label: 'Intermediate', variant: 'warning' },
  ADVANCED: { label: 'Advanced', variant: 'success' },
};

export function MasteryBadge({ level }: MasteryBadgeProps) {
  const config = masteryConfig[level] ?? masteryConfig.BEGINNER;

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
