// File ini berisi komponen untuk halaman ProgressPage
import { TrendingUp } from 'lucide-react';
import { useUserProgressQuery, useProgressSummaryQuery } from '../hooks/useProgressQuery';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { SummaryStats } from '../components/features/progress/SummaryStats';
import { ProgressCard } from '../components/features/progress/ProgressCard';

export function ProgressPage() {
  const { data: progressData, isLoading: progressLoading, error: progressError } = useUserProgressQuery();
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useProgressSummaryQuery();

  const loading = progressLoading || summaryLoading;
  const error = progressError || summaryError;

  const summary = summaryData || (loading ? {
    subjectsTracked: 5,
    totalStudyHours: 120,
    completedSessions: 50,
    advancedSubjects: 1,
    intermediateSubjects: 2,
    beginnerSubjects: 2
  } : null);

  const progress = (progressData && progressData.length > 0) ? progressData : (loading ? Array.from({length: 3}).map((_, i) => ({
    id: `dummy-${i}`,
    subjectName: 'Mata Kuliah Placeholder',
    masteryLevel: 'intermediate',
    totalStudyHours: 40,
    sessionsAttended: 15,
    lastStudiedAt: new Date().toISOString()
  })) : []);

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Gagal memuat progres belajar.</p>
      </div>
    );
  }

  return (
    <phantom-ui fallback-radius="16" loading={loading}>
      <div className="space-y-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-white">Learning Progress</h1>

      {/* Summary */}
      {summary && <SummaryStats summary={summary} />}

      {/* Progress Cards */}
      {progress.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="w-12 h-12" />}
          title="No progress yet"
          description="Join a group and attend sessions to start tracking your learning progress."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.map((p: any) => (
            <ProgressCard key={p.id} progress={p} />
          ))}
        </div>
      )}
    </div>
    </phantom-ui>
  );
}
