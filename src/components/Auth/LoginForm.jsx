import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onToggleMode, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      onClose();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Welcome Back</h2>
        <p className="text-textSecondary">Sign in to your PixelFlow account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-textPrimary mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder-textSecondary"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-textPrimary mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder-textSecondary"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-textPrimary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="ml-2 text-sm text-textSecondary">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => onToggleMode('forgot')}
            className="text-sm text-primary hover:text-accent"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-textSecondary">
          Don't have an account?{' '}
          <button
            onClick={() => onToggleMode('signup')}
            className="text-primary hover:text-accent font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
