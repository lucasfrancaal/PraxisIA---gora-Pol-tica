import React, { ReactNode } from 'react';
import { User } from '../types';
import { LogoutIcon } from './icons/InterfaceIcons';
import { AgoraIcon } from './icons/ContentIcons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, children }) => {
  return (
    <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {children}
        <div className="flex items-center space-x-2">
            <AgoraIcon className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg hidden sm:inline">Práxis IA</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-400 hidden md:inline">{user.email}</span>
        <button 
          onClick={onLogout} 
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-700"
          aria-label="Sair"
        >
          <LogoutIcon />
          <span className="text-sm hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;