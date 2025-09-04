import React from 'react';
import { Menu, Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ user, onAuthClick }) => {
  const { signOut } = useAuth();
  return (
    <header className="bg-surface border-b border-border px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-bg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PixelFlow</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 bg-bg px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{user.credits} credits</span>
              </div>
              <div className="text-sm text-textSecondary hidden sm:block">
                {user.subscription_tier || 'Free'} Plan
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-textSecondary hover:text-textPrimary rounded-lg hover:bg-bg"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAuthClick('login')}
                className="text-sm text-primary hover:text-accent font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => onAuthClick('signup')}
                className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg font-medium"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
