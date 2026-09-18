import React from 'react';
import { IconVisibilitySettings } from '../../types/bi';
import { X } from 'lucide-react';

interface IconToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: IconVisibilitySettings;
  onToggle: (key: keyof IconVisibilitySettings) => void;
}

export const IconToggleModal: React.FC<IconToggleModalProps> = ({
  isOpen,
  onClose,
  settings,
  onToggle,
}) => {
  if (!isOpen) return null;

  const toggles: { key: keyof IconVisibilitySettings; label: string }[] = [
    { key: 'shareLink', label: 'Share Link Action' },
    { key: 'glossary', label: 'Business Glossary Action' },
    { key: 'download', label: 'Export / Download Action' },
    { key: 'fullscreen', label: 'Fullscreen Toggle' },
  ];

  return (
    <div className="fixed inset-0 bg-zinc-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-white rounded-xl shadow-xl border border-zinc-200 w-full max-w-sm overflow-hidden text-xs">
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 text-sm">Customize Actions</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {toggles.map((item) => {
            const isEnabled = settings[item.key];
            return (
              <label
                key={item.key}
                className="p-2.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-zinc-800">{item.label}</span>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => onToggle(item.key)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
              </label>
            );
          })}
        </div>

        <div className="px-4 py-2.5 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-zinc-900 text-white rounded-md font-medium">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
