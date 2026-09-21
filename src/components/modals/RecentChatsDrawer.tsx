import React, { useState } from 'react';
import { ChatSession } from '../../types/bi';
import { History, Plus, Search, MessageSquare, Trash2, X, Check, Database } from 'lucide-react';

interface RecentChatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (id: string) => void;
}

export const RecentChatsDrawer: React.FC<RecentChatsDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timeGroups: ('Today' | 'Yesterday' | 'Previous 7 Days')[] = ['Today', 'Yesterday', 'Previous 7 Days'];

  return (
    <div className="absolute inset-0 z-40 bg-zinc-900/30 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150">
      <div className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col border-r border-zinc-200 text-xs">
        {/* Header */}
        <div className="h-12 px-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1e295b] text-white flex items-center justify-center font-bold">
              <History className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 leading-tight">Recent Conversations</h3>
              <p className="text-[10px] text-zinc-400 font-mono">{sessions.length} recorded sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-200 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            title="Close recent chats"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick New Chat Button & Search */}
        <div className="p-3 border-b border-zinc-100 bg-white space-y-2 flex-shrink-0">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-lg bg-[#1e295b] hover:bg-[#161f46] text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            <span>Start New Chat</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#1e295b] placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Sessions List Grouped by Time */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
              <p className="text-xs">No conversations found matching &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            timeGroups.map((group) => {
              const groupSessions = filteredSessions.filter((s) => s.timeGroup === group);
              if (groupSessions.length === 0) return null;

              return (
                <div key={group} className="space-y-1">
                  <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    {group}
                  </div>
                  <div className="space-y-1">
                    {groupSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            onSelectSession(session.id);
                            onClose();
                          }}
                          className={`w-full group px-2.5 py-2 rounded-lg text-left transition-all flex items-start justify-between gap-2 border cursor-pointer ${
                            isActive
                              ? 'bg-blue-50/80 border-blue-200 text-[#1e295b] shadow-2xs'
                              : 'bg-white hover:bg-zinc-50 border-zinc-200/70 text-zinc-800'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#1e295b]' : 'text-zinc-400'}`} />
                              <span className={`truncate font-medium ${isActive ? 'font-bold text-[#1e295b]' : 'text-zinc-800'}`}>
                                {session.title}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                              <span>{session.updatedAt}</span>
                              {session.datasetId && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono bg-zinc-100 text-zinc-600 px-1 rounded truncate">
                                    {session.datasetId}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-blue-600" title="Active session" />
                            )}
                            {onDeleteSession && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSession(session.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-200 text-zinc-400 hover:text-rose-600 transition-all cursor-pointer"
                                title="Delete session"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/60 text-[10px] text-zinc-500 flex items-center justify-between flex-shrink-0">
          <span>{sessions.length} chats in local history</span>
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="text-[#1e295b] hover:underline font-semibold cursor-pointer"
          >
            + New Chat
          </button>
        </div>
      </div>
    </div>
  );
};
