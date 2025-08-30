
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message, AnalysisSection, Source } from '../types';
import { geminiService } from '../services/geminiService';
import WelcomeScreen from './WelcomeScreen';
import AnalysisOutput from './AnalysisOutput';
import { UserIcon, SparklesIcon } from './icons/ContentIcons';
import { SendIcon } from './icons/InterfaceIcons';

interface ChatWindowProps {
  activeConversation: Conversation | null;
  onSaveConversation: (conversation: Conversation) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeConversation, onSaveConversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(activeConversation ? activeConversation.messages : []);
    setInput('');
    setError(null);
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const { sections, sources } = await geminiService.generateResponse(newMessages);

      const modelMessage: Message = {
        id: uuidv4(),
        role: 'model',
        content: sections,
        sources: sources,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...newMessages, modelMessage];
      setMessages(updatedMessages);

      const conversationToSave: Conversation = {
        id: activeConversation?.id || uuidv4(),
        user_id: '', // Will be set in App.tsx
        title: activeConversation?.title || userMessage.content.toString().substring(0, 50),
        messages: updatedMessages,
        created_at: activeConversation?.created_at || new Date().toISOString(),
      };
      onSaveConversation(conversationToSave);

    } catch (err) {
      console.error(err);
      setError('Desculpe, algo deu errado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeConversation && messages.length === 0) {
    return <WelcomeScreen onPromptClick={(prompt) => setInput(prompt)} />;
  }

  return (
    <div className="h-full flex flex-col p-4 bg-gray-900">
      <div className="flex-1 overflow-y-auto space-y-8 pr-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
             {msg.role === 'model' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-2xl w-full ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {typeof msg.content === 'string' ? (
                     <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {(msg.content as AnalysisSection[]).map(section => (
                            <AnalysisOutput key={section.id} section={section} />
                        ))}
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h4 className="font-bold mb-2 text-indigo-300">Fontes</h4>
                                <ul className="space-y-1">
                                    {msg.sources.map((source, index) => (
                                        <li key={index}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate block">
                                                {source.title || source.uri}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
             {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center order-1">
                  <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <span className="text-gray-400">Práxis está analisando...</span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex-shrink-0">
         {error && <p className="text-red-400 text-center mb-2">{error}</p>}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte sobre políticas públicas..."
            className="flex-1 bg-transparent focus:outline-none resize-none text-white placeholder-gray-500"
            rows={1}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-indigo-600 text-white p-2 rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;