import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getUserProfile, updateUserCredits } from '../services/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Create profile if it doesn't exist
      if (error.code === 'PGRST116') {
        await createUserProfile(userId);
      }
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            user_id: userId,
            email: user?.email,
            credits: 10, // Free credits for new users
            subscription_tier: 'free',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success('Welcome to PixelFlow! You have 10 free credits to get started.');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create user profile');
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link!');
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      toast.success('Welcome back!');
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      toast.success('Password reset email sent!');
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully!');
      return { error: null };
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(error.message);
      return { error };
    }
  };

  const useCredits = async (amount) => {
    if (!profile || profile.credits < amount) {
      toast.error('Insufficient credits');
      return false;
    }

    try {
      const newCredits = profile.credits - amount;
      await updateUserCredits(profile.user_id, newCredits);
      setProfile(prev => ({ ...prev, credits: newCredits }));
      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      toast.error('Failed to use credits');
      return false;
    }
  };

  const addCredits = async (amount) => {
    if (!profile) return false;

    try {
      const newCredits = profile.credits + amount;
      await updateUserCredits(profile.user_id, newCredits);
      setProfile(prev => ({ ...prev, credits: newCredits }));
      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      return false;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    useCredits,
    addCredits,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
