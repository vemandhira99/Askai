import React, { useState } from 'react';
import { MOCK_CHATS, AVAILABLE_DATASETS } from '../../data/mockData';
import { Plus, Search, Check, Database } from 'lucide-react';

interface SidebarChatsProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  activeChatId?: string;
  onSelectChat: (id: string) => void;
  activeDataset: string;
  onSelectDataset: (datasetId: string) => void;
}

export const SidebarChats: React.FC<SidebarChatsProps> = ({
  isOpen,
  onClose,
  onNewChat,
  activeChatId = 'chat-1',
  onSelectChat,
  activeDataset,
  onSelectDataset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredChats = MOCK_CHATS.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-60 border-r border-zinc-200 bg-zinc-50/80 flex flex-col h-full flex-shrink-0 select-none text-xs">
      {/* New chat + Search */}
      <div className="p-3 border-b border-zinc-200/80 space-y-2">
        <button
          onClick={onNewChat}
          className="w-full py-1.5 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg flex items-center justify-center gap-1.5 font-medium shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </button>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2.5 py-1 bg-white border border-zinc-200 rounded-md text-xs placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
        {/* Datasets */}
        <div>
          <span className="px-2 pb-1 block text-[10px] font-mono uppercase text-zinc-400">Datasets</span>
          <div className="space-y-0.5">
            {AVAILABLE_DATASETS.map((ds) => {
              const isSelected = ds.id === activeDataset;
              return (
                <button
                  key={ds.id}
                  onClick={() => onSelectDataset(ds.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-zinc-200/70 text-zinc-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span className="truncate font-mono text-[11px]">{ds.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-zinc-900 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <span className="px-2 pb-1 block text-[10px] font-mono uppercase text-zinc-400">Recent</span>
          <div className="space-y-0.5">
            {filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex flex-col transition-colors ${
                    isActive ? 'bg-zinc-200/70 text-zinc-900 font-medium' : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span className="truncate">{chat.title}</span>
                  <span className="text-[10px] text-zinc-400">{chat.updatedAt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
