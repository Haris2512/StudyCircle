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
    <div className="space-y-8 pb-12 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-[#0B0F19] rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Welcome back, {user?.fullName ?? 'Student'}! <span className="animate-pulse-glow inline-block">👋</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base md:text-lg max-w-xl">
            Here's an overview of your study activity and smart recommendations tailored just for you.
          </p>
        </div>
      </div>

      {/* Recommendations Section */}
      <section className="bg-[#0B0F19]/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl animate-fade-in-up animate-delay-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">✨</span>
            Smart Recommendations
          </h2>
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
      <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-200">
        <Button size="lg" onClick={() => navigate('/groups')}>
          <BookOpen className="w-5 h-5" />
          Browse All Groups
        </Button>
        <Button variant="secondary" onClick={() => navigate('/progress')}>
          <TrendingUp className="w-4 h-4" />
          View Detailed Progress
        </Button>
      </div>

      {/* My Groups */}
      <section className="animate-fade-in-up animate-delay-300">
        <h2 className="text-2xl font-bold text-white mb-6">My Study Groups</h2>
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
