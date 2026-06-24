// Komponen ini merupakan bagian dari antarmuka pengguna
import React from 'react';
import { Card } from '../../common/Card';
import { Lightbulb, Brain, Eye, Headphones, PenTool, Hand } from 'lucide-react';

interface LearningStyleInsightProps {
  learningStyle?: string | null;
}

export const LearningStyleInsight: React.FC<LearningStyleInsightProps> = ({ learningStyle }) => {
  if (!learningStyle) {
    return (
      <Card className="bg-gradient-to-br from-[#0B0F19]/80 to-purple-900/10 border-purple-500/20 backdrop-blur-md">
        <div className="flex items-start space-x-4">
          <div className="text-4xl animate-pulse-glow text-purple-400"><Lightbulb className="w-8 h-8" /></div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Unlock Smart Recommendations!
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Set your learning style in your profile to get personalized group and material recommendations.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  let IconComponent = Brain;
  let recommended: string[] = [];

  switch (learningStyle.toLowerCase()) {
    case 'visual':
      IconComponent = Eye;
      recommended = ['Diagrams', 'Slides', 'Mind Maps', 'Videos'];
      break;
    case 'auditory':
      IconComponent = Headphones;
      recommended = ['Discussions', 'Podcasts', 'Audio Notes', 'Debates'];
      break;
    case 'reading/writing':
    case 'reading':
      IconComponent = PenTool;
      recommended = ['Textbooks', 'Essays', 'Study Notes', 'Summaries'];
      break;
    case 'kinesthetic':
      IconComponent = Hand;
      recommended = ['Practice Exams', 'Interactive Labs', 'Code Snippets', 'Roleplay'];
      break;
    default:
      IconComponent = Brain;
      recommended = ['Mixed Materials', 'Peer Discussions', 'Practice Quizzes'];
  }

  return (
    <Card className="bg-gradient-to-br from-[#0B0F19]/80 to-cyan-900/10 border-cyan-500/20 backdrop-blur-md h-full">
      <div className="flex items-start space-x-4">
        <div className="text-4xl animate-pulse-glow text-cyan-400"><IconComponent className="w-8 h-8" /></div>
        <div>
          <h3 className="text-lg font-bold text-white">
            You are a <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">{learningStyle}</span> Learner
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Recommended material types for your groups:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {recommended.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm"
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
