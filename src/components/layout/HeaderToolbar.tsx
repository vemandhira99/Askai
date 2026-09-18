import React from 'react';
import { WorkspaceMode, CanvasViewMode, IconVisibilitySettings } from '../../types/bi';
import { 
  Link2, 
  Maximize2, 
  Check, 
  PanelRight, 
  X, 
  ArrowLeft,
  Database,
  History,
  Download,
  Plus,
  Minimize2,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderToolbarProps {
  mode: WorkspaceMode;
  onSetMode: (mode: WorkspaceMode) => void;
  canvasViewMode: CanvasViewMode;
  onSetCanvasViewMode: (mode: CanvasViewMode) => void;
  iconSettings: IconVisibilitySettings;
  onToggleIconSettings: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onToggleGlossary: () => void;
  onNewChat: () => void;
  activeDataset: string;
  onClose?: () => void;
}

export const HeaderToolbar: React.FC<HeaderToolbarProps> = ({
  mode,
  onSetMode,
  canvasViewMode,
  onSetCanvasViewMode,
  iconSettings,
  onToggleIconSettings,
  onToggleSidebar,
  isSidebarOpen,
  onToggleGlossary,
  onNewChat,
  activeDataset,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const handleDownload = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Value\nAction,1751.2\nSports,1330.9\nShooter,1037.4';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeDataset}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="h-14 px-4 border-b border-zinc-200 bg-white flex items-center justify-between select-none z-30 flex-shrink-0 text-xs">
      {/* Left: Blue square Ai emblem + Ask Akashic BI title + Subtitle (From Screenshot!) */}
      <div className="flex items-center gap-3">
        {mode === 'fullscreen' && (
          <button
            onClick={() => onSetMode('modal')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium mr-1 transition-colors"
            title="Return to dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        <div className="w-7 h-7 rounded-md bg-[#1e295b] text-white flex items-center justify-center text-xs font-bold shadow-2xs flex-shrink-0">
          Ai
        </div>

        <div>
          <h2 className="text-xs sm:text-sm font-bold text-[#1e295b] leading-tight">Ask Akashic BI</h2>
          <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">Ask about this dashboard or create a chart from a prompt.</p>
        </div>
      </div>

      {/* Center: Canvas View Mode Switcher (Visible in Fullscreen or when in canvas) */}
      {mode === 'fullscreen' && (
        <div className="hidden md:flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs font-medium">
          <button
            onClick={() => onSetCanvasViewMode('chat-only')}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              canvasViewMode === 'chat-only' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => onSetCanvasViewMode('split')}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              canvasViewMode === 'split' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onSetCanvasViewMode('canvas-only')}
            className={`px-2.5 py-0.5 rounded-md transition-all ${
              canvasViewMode === 'canvas-only' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Canvas
          </button>
        </div>
      )}

      {/* Right: Dark Navy Toolbar Buttons Matching Screenshot Image Exactly */}
      <div className="flex items-center gap-1.5">
        {/* 1. Share Link */}
        {iconSettings.shareLink && (
          <button
            onClick={handleCopyLink}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Share session link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* 2. Business Glossary & Semantics */}
        {iconSettings.glossary && (
          <button
            onClick={onToggleGlossary}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Business Glossary & AI Instructions"
          >
            <Database className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 3. History / Sidebar */}
        {iconSettings.history && (
          <button
            onClick={onToggleSidebar}
            className={`w-7 h-7 rounded-md transition-colors flex items-center justify-center shadow-2xs ${
              isSidebarOpen ? 'bg-zinc-800 text-white' : 'bg-[#1e295b] hover:bg-[#151d42] text-white'
            }`}
            title="Chat history and sessions"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 4. Download */}
        {iconSettings.download && (
          <button
            onClick={handleDownload}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Download analysis data"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 5. Window Mode: Fullscreen vs Dock as Tab */}
        {mode !== 'fullscreen' ? (
          <button
            onClick={() => onSetMode('fullscreen')}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Expand to Full Screen Codex Canvas"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onSetMode('modal')}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Restore to Short Chatbot Modal"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {mode === 'modal' && (
          <button
            onClick={() => onSetMode('docked')}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
            title="Dock as Side Tab alongside dashboard"
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* 6. New Chat (+) */}
        <button
          onClick={onNewChat}
          className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-[#151d42] text-white flex items-center justify-center transition-colors shadow-2xs"
          title="New analysis (reset)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* 7. Close (X) */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-[#1e295b] hover:bg-rose-700 text-white flex items-center justify-center transition-colors shadow-2xs ml-0.5"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
