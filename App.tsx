
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Login from './components/Login';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';
import ChatWindow from './components/ChatWindow';
import { User, Conversation } from './types';
import { authService } from './services/authService';
import { conversationService } from './services/conversationService';
import { MenuIcon, XIcon } from './components/icons/InterfaceIcons';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const sessionUser = await authService.getUser();
      if (sessionUser) {
        setUser(sessionUser);
        const userConversations = await conversationService.getConversations(sessionUser.id);
        setConversations(userConversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    };
    checkSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    conversationService.getConversations(loggedInUser.id).then(userConversations => {
        setConversations(userConversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setConversations([]);
    setActiveConversationId(null);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
  };
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    if (!user) return;
    await conversationService.deleteConversation(id);
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleSaveConversation = async (conversation: Conversation) => {
    if (!user) return;
    const savedConversation = await conversationService.saveConversation({ ...conversation, user_id: user.id });
    const existingIndex = conversations.findIndex(c => c.id === savedConversation.id);
    let updatedConversations;
    if (existingIndex > -1) {
        updatedConversations = [...conversations];
        updatedConversations[existingIndex] = savedConversation;
    } else {
        updatedConversations = [savedConversation, ...conversations];
    }
     setConversations(updatedConversations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    if (!activeConversationId) {
        setActiveConversationId(savedConversation.id);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }
  
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 font-sans">
      <div className={`transform ${isHistoryPanelOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:w-80 w-full h-full bg-gray-900 border-r border-gray-700 flex flex-col absolute md:static z-20`}>
        <HistoryPanel
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          activeConversationId={activeConversationId}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <Header user={user} onLogout={handleLogout}>
          <button onClick={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
             {isHistoryPanelOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </Header>
        <main className="flex-1 overflow-y-auto">
          <ChatWindow 
            key={activeConversationId || 'new'}
            activeConversation={activeConversation}
            onSaveConversation={handleSaveConversation}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
