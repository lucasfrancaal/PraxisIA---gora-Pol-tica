import React from 'react';
import { Conversation } from '../types';
import { PlusIcon, TrashIcon, ChatIcon } from './icons/InterfaceIcons';

interface HistoryPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation 
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-700">
        <button 
          onClick={onNewConversation}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          <PlusIcon />
          <span>Nova Conversa</span>
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
              activeConversationId === conv.id ? 'bg-indigo-500/30' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className="flex items-center space-x-3 truncate">
                <ChatIcon />
                <span className="text-sm font-medium truncate">{conv.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 rounded-full hover:bg-gray-600"
              aria-label="Deletar conversa"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Copyright {new Date().getFullYear()}. Desenvolvido por Ágora Inteligência Política
      </div>
    </div>
  );
};

export default HistoryPanel;