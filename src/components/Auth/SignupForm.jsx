import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm = ({ onToggleMode, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password);
    
    if (!error) {
      onClose();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Create Account</h2>
        <p className="text-textSecondary">Join PixelFlow and start creating amazing images</p>
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder-textSecondary"
              placeholder="Create a password"
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
          <p className="text-xs text-textSecondary mt-1">Must be at least 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-textPrimary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-textPrimary placeholder-textSecondary"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-textPrimary"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2 mt-1"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-textSecondary">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:text-accent">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:text-accent">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-textSecondary">
          Already have an account?{' '}
          <button
            onClick={() => onToggleMode('login')}
            className="text-primary hover:text-accent font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
