import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { AgoraIcon } from './icons/ContentIcons';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Falha no login. Por favor, verifique suas credenciais.');
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 relative">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-600 p-3 rounded-full">
            <AgoraIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-4">Práxis IA Assistente</h1>
          <p className="text-lg text-indigo-300 mt-1">Ágora Política</p>
          <p className="text-gray-400 mt-4">Faça login para acessar seu assistente de gestão pública.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Endereço de E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="voce@exemplo.com"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-xs text-gray-500 text-center">
        Copyright {new Date().getFullYear()}. Desenvolvido por Ágora Inteligência Política
      </div>
    </div>
  );
};

export default Login;