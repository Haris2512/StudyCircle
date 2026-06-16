import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Pencil } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfileQuery, useUpdateProfileMutation, useUpdateLearningStyleMutation } from '../hooks/useProfileQuery';
import { Card } from '../components/common/Card';
import { FormInput } from '../components/common/FormInput';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { gooeyToast } from 'goey-toast';

const LEARNING_STYLES = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];

export function ProfilePage() {
  const { user } = useAuth();

  const { data: profile, isLoading, error: profileError } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const updateLearningStyleMutation = useUpdateLearningStyleMutation();

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editTimezone, setEditTimezone] = useState('');

  // Sync edit state values when profile query loads
  useEffect(() => {
    if (profile) {
      setEditName(profile.fullName);
      setEditBio(profile.bio ?? '');
      setEditTimezone(profile.timezone ?? 'Asia/Jakarta');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({ name: editName.trim(), bio: editBio.trim(), timezone: editTimezone });
      setIsEditing(false);
      gooeyToast.success('Profil berhasil diperbarui');
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Gagal memperbarui profil');
    }
  };

  const handleUpdateLearningStyle = async (style: string) => {
    try {
      await updateLearningStyleMutation.mutateAsync({ primaryStyle: style });
      gooeyToast.success('Learning Style berhasil diperbarui');
    } catch (err: any) {
      gooeyToast.error(err.response?.data?.error || 'Gagal memperbarui learning style');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-[60vh]" />;
  }

  if (profileError && !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 mb-4">Gagal memuat profil</p>
      </div>
    );
  }

  const initials = (profile?.fullName ?? user?.fullName ?? '??')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      {/* Avatar & Info Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Initials Avatar */}
          <div className="shrink-0 w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold text-white" role="img" aria-label="Avatar">
            {initials}
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            {isEditing ? (
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-300">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-dark-card text-white placeholder-gray-500 border border-gray-700/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="timezone" className="text-sm font-medium text-gray-300">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={editTimezone}
                    onChange={(e) => setEditTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-dark-card text-white border border-gray-700/50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200 text-sm"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} loading={updateProfileMutation.isPending} disabled={!editName.trim()}>
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={updateProfileMutation.isPending}
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile?.fullName ?? '');
                      setEditBio(profile?.bio ?? '');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-xl font-bold text-white">{profile?.fullName}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    aria-label="Ubah profil"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                {profile?.bio && (
                  <p className="text-sm text-gray-400 mt-1">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20">
                    <span className="text-xs text-primary-300 font-semibold block">Level</span>
                    <span className="text-lg font-bold text-primary-400">{profile?.level || 1}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-secondary-500/10 border border-secondary-500/20">
                    <span className="text-xs text-secondary-300 font-semibold block">Points</span>
                    <span className="text-lg font-bold text-secondary-400">{profile?.points || 0}</span>
                  </div>
                  
                  {/* Gamification Badge */}
                  <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center">
                    <span className="text-xs text-amber-300 font-semibold block">Badge</span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1 mt-1">
                      {profile?.level < 5 ? 'Pemula' : profile?.level < 10 ? 'Pelajar Aktif' : profile?.level < 20 ? 'Sarjana' : 'Master'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4 shrink-0" />
                    <span>@{profile?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{profile?.email}</span>
                  </div>
                  {profile?.semester != null && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>Semester {profile.semester}</span>
                    </div>
                  )}
                  {profile?.timezone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Timezone: {profile.timezone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Learning Style */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Learning Style</h3>

        {profile?.learningStyle?.primaryStyle && (
          <div className="mb-4">
            <span className="text-sm text-gray-400">Current style: </span>
            <Badge variant="info">{profile.learningStyle.primaryStyle}</Badge>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {LEARNING_STYLES.map((style) => (
            <Button
              key={style}
              size="sm"
              variant={profile?.learningStyle?.primaryStyle === style ? 'primary' : 'secondary'}
              loading={updateLearningStyleMutation.isPending && updateLearningStyleMutation.variables?.primaryStyle === style}
              onClick={() => handleUpdateLearningStyle(style)}
              aria-pressed={profile?.learningStyle?.primaryStyle === style}
            >
              {style}
            </Button>
          ))}
        </div>
      </Card>

    </div>
  );
}
