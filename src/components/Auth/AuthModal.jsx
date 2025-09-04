import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleToggleMode = (newMode) => {
    setMode(newMode);
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return <LoginForm onToggleMode={handleToggleMode} onClose={onClose} />;
      case 'signup':
        return <SignupForm onToggleMode={handleToggleMode} onClose={onClose} />;
      case 'forgot':
        return <ForgotPasswordForm onToggleMode={handleToggleMode} onClose={onClose} />;
      default:
        return <LoginForm onToggleMode={handleToggleMode} onClose={onClose} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-2xl border border-border">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Form content */}
          <div className="mt-2">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
