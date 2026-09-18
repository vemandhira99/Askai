import React, { useRef, useEffect } from 'react';
import { ArrowUp, AtSign } from 'lucide-react';

interface ComposerProps {
  text: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isExecuting: boolean;
  stashedDraft: string | null;
  onRestoreDraft: () => void;
  onOpenDatasetPicker?: () => void;
  activeDataset?: string;
}

export const Composer: React.FC<ComposerProps> = ({
  text,
  onChange,
  onSubmit,
  isExecuting,
  stashedDraft,
  onRestoreDraft,
  onOpenDatasetPicker,
  activeDataset = 'video_game_sales',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
      {stashedDraft && (
        <div className="max-w-2xl mx-auto mb-2 px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-between text-xs text-zinc-700">
          <span>Previous unsaved draft preserved during Undo</span>
          <button onClick={onRestoreDraft} className="font-semibold text-zinc-900 hover:underline">
            Restore
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto relative rounded-2xl border border-zinc-200/90 bg-white shadow-xs focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-400/20 transition-all p-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          rows={1}
          placeholder="Ask anything about this dashboard..."
          className="w-full px-1 pt-1 pb-6 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent resize-none focus:outline-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-1 border-t border-zinc-50 select-none">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span>Enter to send - Shift+Enter new line - @ pins a dataset</span>
            {onOpenDatasetPicker && (
              <button
                onClick={onOpenDatasetPicker}
                className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded transition-colors"
                title="Switch dataset"
              >
                <AtSign className="w-2.5 h-2.5" />
                <span>{activeDataset}</span>
              </button>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={!text.trim() || isExecuting}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              text.trim() && !isExecuting
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
            title="Send"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
