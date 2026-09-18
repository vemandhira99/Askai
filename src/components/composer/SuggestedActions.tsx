import React from 'react';
import { SuggestedAction } from '../../types/bi';
import { ArrowUpRight } from 'lucide-react';

interface SuggestedActionsProps {
  suggestions: SuggestedAction[];
  onSelectSuggestion: (prompt: string) => void;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({ 
  suggestions, 
  onSelectSuggestion 
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-3 pt-2">
      <div className="flex flex-wrap gap-1.5">
        {suggestions.slice(0, 3).map((sug) => (
          <button
            key={sug.id}
            onClick={() => onSelectSuggestion(sug.prompt)}
            className="group inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-zinc-200 hover:border-zinc-400 bg-white text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs"
            title={`Fill composer: "${sug.prompt}"`}
          >
            <span>{sug.label}</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
