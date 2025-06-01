'use client';

import React, { useState, useEffect, useCallback, createContext, ReactNode, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/app/lib/supabase';
import { getUserProfile, createUserProfile } from '@/app/lib/database';
import { AuthState, UserProfile, AuthUser } from '@/app/types/auth';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  const transformUser = (supabaseUser: User): AuthUser => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    user_metadata: supabaseUser.user_metadata
  });

  const loadUserProfile = useCallback(async (user: AuthUser) => {
    try {
      let profile = await getUserProfile(user.id);
      
      // Create profile if it doesn't exist
      if (!profile) {
        profile = await createUserProfile(user);
      }

      setState(prev => ({
        ...prev,
        user,
        profile,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error loading user profile:', error);
      setState(prev => ({
        ...prev,
        user,
        profile: null,
        loading: false,
        error: 'Failed to load user profile'
      }));
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    await loadUserProfile(state.user);
  }, [state.user, loadUserProfile]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          const authUser = transformUser(session.user);
          await loadUserProfile(authUser);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to initialize authentication'
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const authUser = transformUser(session.user);
          await loadUserProfile(authUser);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.error('Google sign in supabase error:', error);

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to sign in with Google'
      }));
    }
  };

  const signInWithTwitter = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Twitter sign in error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to sign in with Twitter'
      }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to sign out'
      }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithTwitter,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}