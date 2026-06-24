// Komponen ini merupakan bagian dari antarmuka pengguna
import { BookOpen, Clock, CheckCircle, Trophy, BookMarked, Sprout } from 'lucide-react';
import { Card } from '../../common/Card';
import type { ProgressSummary } from '../../../types';

interface SummaryStatsProps {
  summary: ProgressSummary;
}

import type { ReactNode } from 'react';

interface StatItem {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export function SummaryStats({ summary }: SummaryStatsProps) {
  const stats: StatItem[] = [
    {
      label: 'Subjects Tracked',
      value: summary.subjectsTracked,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-indigo-400',
    },
    {
      label: 'Total Study Hours',
      value: summary.totalStudyHours.toFixed(1),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-400',
    },
    {
      label: 'Completed Sessions',
      value: summary.completedSessions,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-400',
    },
    {
      label: 'Advanced',
      value: summary.advancedSubjects,
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-yellow-400',
    },
    {
      label: 'Intermediate',
      value: summary.intermediateSubjects,
      icon: <BookMarked className="w-5 h-5" />,
      color: 'text-orange-400',
    },
    {
      label: 'Beginner',
      value: summary.beginnerSubjects,
      icon: <Sprout className="w-5 h-5" />,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className={`shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="min-w-0 flex flex-col justify-center gap-1.5">
              <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
              <p className="text-xs text-gray-400 truncate leading-none">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
