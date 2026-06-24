/**
 * Hook kustom untuk memberikan rekomendasi grup belajar berdasarkan gaya belajar dan subjek.
 */
import { useMemo } from 'react';
import type { Group, UserProfile, Progress } from '../types';
import type { RecommendedGroup } from '../types/recommendations';

export const useRecommendations = (
  groups: Group[],
  userProfile?: UserProfile | null,
  progressData?: Progress[] | null
) => {
  return useMemo(() => {
    if (!groups || !groups.length) return [];

    const activeSubjectIds = new Set((progressData || []).map(p => p.subjectId));
    const learningStyle = userProfile?.learningStyle?.primaryStyle || '';

    const scoredGroups: RecommendedGroup[] = [];

    for (const group of groups) {
      // Exclude full groups
      if (group._count && group._count.members >= group.maxMembers) {
        continue;
      }

      let score = 0;
      const matchReasons: string[] = [];

      // 1. Subject Match (60 pts)
      if (activeSubjectIds.has(group.subjectId)) {
        score += 60;
        matchReasons.push('Subject Match');
      }

      // 2. Learning Style Keyword Match (20 pts)
      const textToSearch = `${group.name} ${group.description || ''}`.toLowerCase();
      let matchedStyle = false;

      if (learningStyle === 'Visual' && /diagram|visual|design|ui|watch|video|picture/.test(textToSearch)) {
        matchedStyle = true;
      } else if (learningStyle === 'Auditory' && /discuss|talk|podcast|voice|listen|debate|speak/.test(textToSearch)) {
        matchedStyle = true;
      } else if (learningStyle === 'Reading/Writing' && /read|write|notes|book|text|essay|summary|paper/.test(textToSearch)) {
        matchedStyle = true;
      } else if (learningStyle === 'Kinesthetic' && /practice|code|build|project|hands-on|exercise|lab/.test(textToSearch)) {
        matchedStyle = true;
      }

      if (matchedStyle) {
        score += 20;
        matchReasons.push(`${learningStyle} Friendly`);
      } else if (learningStyle) {
        // Fallback neutral
        score += 10;
      }

      // 3. Capacity / Health Match (20 pts)
      if (group._count && group.maxMembers > 0) {
        const fillRatio = group._count.members / group.maxMembers;
        if (fillRatio >= 0.2 && fillRatio <= 0.8) {
          score += 20;
          matchReasons.push('Active Group');
        } else if (fillRatio > 0.8) {
          score += 10;
        } else {
          score += 10; // brand new
        }
      }

      scoredGroups.push({ ...group, compatibilityScore: score, matchReasons });
    }

    // Sort descending
    scoredGroups.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Return top 5
    return scoredGroups.slice(0, 5);
  }, [groups, userProfile, progressData]);
};
