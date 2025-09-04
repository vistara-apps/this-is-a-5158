import React from 'react';
import { Menu, Zap } from 'lucide-react';

const Header = ({ user }) => {
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
          <div className="flex items-center space-x-2 bg-bg px-3 py-2 rounded-lg">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{user.credits} credits</span>
          </div>
          <div className="text-sm text-textSecondary hidden sm:block">
            {user.subscriptionTier} Plan
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;