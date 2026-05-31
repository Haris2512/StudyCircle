import type { Group } from './index';

export interface RecommendationScore {
  groupId: string;
  score: number;
  matchReasons: string[];
}

export interface RecommendedGroup extends Group {
  compatibilityScore: number;
  matchReasons: string[];
}
