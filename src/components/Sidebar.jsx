import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Grid3X3, 
  History, 
  User, 
  Settings,
  Zap 
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'batch', label: 'Batch', icon: Layers },
    { id: 'templates', label: 'Templates', icon: Grid3X3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border flex-shrink-0 hidden lg:flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">PixelFlow</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-textSecondary hover:text-textPrimary hover:bg-surface/50">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;