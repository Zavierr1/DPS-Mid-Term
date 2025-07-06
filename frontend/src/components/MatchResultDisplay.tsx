import React from 'react';
import { CheckCircle, XCircle, Target, Zap, Star } from 'lucide-react';

interface MatchResultDisplayProps {
  isCorrect: boolean | null;
  matchType?: string;
  similarity?: number;
  confidence?: number;
  explanation?: string;
  showDetails?: boolean;
}

const MatchResultDisplay: React.FC<MatchResultDisplayProps> = ({
  isCorrect,
  matchType = 'exact',
  similarity = 100,
  confidence = 100,
  explanation,
  showDetails = true
}) => {
  if (isCorrect === null) return null;

  const getMatchTypeInfo = (type: string) => {
    switch (type) {
      case 'exact':
        return {
          label: 'Exact Match',
          color: 'text-green-700',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500',
          icon: <Target className="w-5 h-5 text-green-600" />,
          description: 'Perfect match! Full points awarded.'
        };
      case 'synonym':
        return {
          label: 'Synonym Match',
          color: 'text-blue-700',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500',
          icon: <Star className="w-5 h-5 text-blue-600" />,
          description: 'Alternative term accepted. Well done!'
        };
      case 'abbreviation':
        return {
          label: 'Abbreviation Match',
          color: 'text-purple-700',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500',
          icon: <Zap className="w-5 h-5 text-purple-600" />,
          description: 'Acronym recognized. Great!'
        };
      case 'fuzzy':
        return {
          label: 'Fuzzy Match',
          color: 'text-orange-700',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500',
          icon: <CheckCircle className="w-5 h-5 text-orange-600" />,
          description: 'Close enough! Minor variations accepted.'
        };
      case 'alternative':
        return {
          label: 'Alternative Spelling',
          color: 'text-cyan-700',
          bgColor: 'bg-cyan-500/10',
          borderColor: 'border-cyan-500',
          icon: <Star className="w-5 h-5 text-cyan-600" />,
          description: 'Alternative spelling recognized.'
        };
      default:
        return {
          label: 'Match',
          color: 'text-green-700',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          description: 'Answer accepted!'
        };
    }
  };

  if (!isCorrect) {
    return (
      <div className="p-4 rounded-lg border-l-4 bg-red-500/10 border-red-500">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">
              Answer not recognized. Please try again.
            </p>
            <p className="text-sm text-red-600 mt-1">
              Check your spelling, try a different variation, or use the hint for guidance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const matchInfo = getMatchTypeInfo(matchType);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${matchInfo.bgColor} ${matchInfo.borderColor}`}>
      <div className="flex items-start gap-3">
        {matchInfo.icon}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className={`font-semibold ${matchInfo.color}`}>
              Success! {matchInfo.label}
            </p>
            {showDetails && confidence < 100 && (
              <span className="text-xs bg-white/50 px-2 py-1 rounded-full font-medium">
                {confidence.toFixed(0)}% confidence
              </span>
            )}
          </div>
          
          <p className={`text-sm ${matchInfo.color} mb-2`}>
            {matchInfo.description}
          </p>

          {explanation && (
            <p className="text-sm text-slate-600">
              {explanation}
            </p>
          )}

          {showDetails && matchType !== 'exact' && (
            <div className="mt-3 pt-3 border-t border-slate-200/50">
              <div className="text-xs text-slate-500 space-y-1">
                {similarity < 100 && (
                  <div>Similarity: {similarity.toFixed(1)}%</div>
                )}
                <div className="text-slate-400">
                  💡 The system accepted your answer even though it wasn't an exact match!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResultDisplay;
