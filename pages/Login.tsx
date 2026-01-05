import React, { useState } from 'react';
import { useAuth } from '../store';
import { AppRoute } from '../types';
import { Card, Button, Input } from '../components/ui';
import { Lock, User as UserIcon, Store } from 'lucide-react';

export const Login = ({ onNavigate }: { onNavigate: (r: AppRoute) => void }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      onNavigate(AppRoute.DASHBOARD);
    } else {
      setError('Invalid username or password. Try admin / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Card className="w-full max-w-md p-8 border-t-4 border-t-amazon-orange shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            <span className="text-amazon-orange">Kashish</span> Hardware
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Enterprise Internal System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button type="submit" className="w-full py-3 text-lg bg-amazon-blue hover:bg-amazon-light">
            Secure Login <Lock size={16} className="inline ml-2" />
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center">
          <button 
            onClick={() => onNavigate(AppRoute.FORGOT_PASSWORD)}
            className="text-sm text-amazon-blue hover:underline dark:text-sky-400"
          >
            Forgot Password?
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Public Access</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => onNavigate(AppRoute.PUBLIC_PRICES)}
            className="w-full"
          >
            <Store size={16} className="inline mr-2" /> View Public Price List
          </Button>
        </div>
      </Card>
    </div>
  );
};
