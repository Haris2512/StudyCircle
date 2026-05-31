import React from 'react';
import { Card } from '../../common/Card';

interface LearningStyleInsightProps {
  learningStyle?: string | null;
}

export const LearningStyleInsight: React.FC<LearningStyleInsightProps> = ({ learningStyle }) => {
  if (!learningStyle) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800/50">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Unlock Smart Recommendations!
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Set your learning style in your profile to get personalized group and material recommendations.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  let icon = '🧠';
  let recommended = [];

  switch (learningStyle.toLowerCase()) {
    case 'visual':
      icon = '👁️';
      recommended = ['Diagrams', 'Slides', 'Mind Maps', 'Videos'];
      break;
    case 'auditory':
      icon = '🎧';
      recommended = ['Discussions', 'Podcasts', 'Audio Notes', 'Debates'];
      break;
    case 'reading/writing':
    case 'reading':
      icon = '📝';
      recommended = ['Textbooks', 'Essays', 'Study Notes', 'Summaries'];
      break;
    case 'kinesthetic':
      icon = '🤚';
      recommended = ['Practice Exams', 'Interactive Labs', 'Code Snippets', 'Roleplay'];
      break;
    default:
      icon = '🧠';
      recommended = ['Mixed Materials', 'Peer Discussions', 'Practice Quizzes'];
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800/50 h-full">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            You are a {learningStyle} Learner
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Recommended material types for your groups:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommended.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
