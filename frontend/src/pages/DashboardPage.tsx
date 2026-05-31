import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGroups } from '../hooks/useGroups';
import { useProgress } from '../hooks/useProgress';
import { useRecommendations } from '../hooks/useRecommendations';
import { usersApi } from '../api/users.api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { GroupCard } from '../components/features/groups/GroupCard';
import { SummaryStats } from '../components/features/progress/SummaryStats';
import { LearningStyleInsight } from '../components/features/recommendations/LearningStyleInsight';
import { RecommendedGroupCard } from '../components/features/recommendations/RecommendedGroupCard';
import type { UserProfile } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, loading: groupsLoading, joinGroup } = useGroups();
  const { progress, summary, loading: progressLoading, fetchProgress, fetchSummary } = useProgress();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
    fetchProgress();
    
    // Fetch full profile for learning style
    usersApi.getProfile()
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setProfileLoading(false));
  }, []);

  const recommendedGroups = useRecommendations(groups, profile, progress);

  const isLoading = groupsLoading || progressLoading || profileLoading;

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  // Identify "My Groups" based on membership
  const myGroups = groups.filter(g => g.members?.some(m => m.userId === user?.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/20 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, {user?.fullName ?? 'Student'}! 👋
        </h1>
        <p className="text-gray-300 mt-2 text-sm md:text-base">
          Here's an overview of your study activity and smart recommendations.
        </p>
      </div>

      {/* Recommendations Section */}
      <section className="bg-white/5 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">StudyCircle Recommendations</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recommended Groups Carousel */}
          <div className="lg:col-span-8">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Top Matches For You
            </h3>
            {recommendedGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedGroups.slice(0, 2).map((group) => (
                  <RecommendedGroupCard
                    key={group.id}
                    group={group}
                    onJoin={async (id) => {
                      await joinGroup(id);
                      navigate(`/groups/${id}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No new matches"
                description="You've joined all the best groups! Keep up the good work."
              />
            )}
          </div>

          {/* Insights & Progress */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                Learning Insight
              </h3>
              <LearningStyleInsight learningStyle={profile?.learningStyle?.primaryStyle} />
            </div>
            
            {summary && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                  Quick Stats
                </h3>
                <SummaryStats summary={summary} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/groups')}>
          <BookOpen className="w-4 h-4" />
          Browse All Groups
        </Button>
        <Button variant="secondary" onClick={() => navigate('/progress')}>
          <TrendingUp className="w-4 h-4" />
          View Detailed Progress
        </Button>
      </div>

      {/* My Groups */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Groups</h2>
        {myGroups.length === 0 ? (
          <EmptyState
            title="No groups yet"
            description="Join a study group from your recommendations above to start collaborating!"
            action={
              <Button onClick={() => navigate('/groups')}>
                Browse Groups
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember
                onJoin={() => {}}
                onClick={() => navigate(`/groups/${group.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
