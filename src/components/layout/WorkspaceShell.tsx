import React from 'react';
import { WorkspaceMode, CanvasViewMode } from '../../types/bi';

interface WorkspaceShellProps {
  mode: WorkspaceMode;
  canvasViewMode: CanvasViewMode;
  isSidebarOpen: boolean;
  header: React.ReactNode;
  contextBar: React.ReactNode;
  sidebar: React.ReactNode;
  transcript: React.ReactNode;
  composer: React.ReactNode;
  artifactPane: React.ReactNode;
  onClose: () => void;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  mode,
  canvasViewMode,
  isSidebarOpen,
  header,
  contextBar,
  sidebar,
  transcript,
  composer,
  artifactPane,
}) => {
  const content = (
    <div className="flex-1 flex overflow-hidden relative">
      {/* 1. Left Sidebar */}
      {isSidebarOpen && sidebar}

      {/* 2. Chat Pane */}
      {(canvasViewMode === 'chat-only' || canvasViewMode === 'split') && (
        <main className={`flex flex-col h-full overflow-hidden bg-white transition-all ${
          canvasViewMode === 'split' ? 'w-full lg:w-1/2 xl:w-[48%]' : 'flex-1'
        }`}>
          {transcript}
          {composer}
        </main>
      )}

      {/* 3. Codex Canvas Artifact Pane */}
      {(canvasViewMode === 'canvas-only' || canvasViewMode === 'split') && (
        <div className="flex flex-col h-full overflow-hidden bg-white flex-1">
          {artifactPane}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white font-sans text-zinc-900">
      {header}
      {contextBar}
      {content}
    </div>
  );
};
