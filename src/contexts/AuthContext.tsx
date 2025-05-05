import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useErrorBoundary } from '../hooks/useErrorBoundary';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'linkedin') => Promise<void>;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { handleError } = useErrorBoundary();

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (session) {
        setUser(session.user);
        setIsAdmin(session.user.user_metadata?.role === 'admin' ?? false);
      }
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.refreshSession');
      }
      await signOut();
    }
  };

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    const setupRefreshTimer = (expiresIn: number) => {
      const refreshTime = (expiresIn - 300) * 1000;
      refreshTimer = setTimeout(refreshSession, refreshTime);
    };

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        handleError(error, 'AuthContext.getSession');
        return;
      }

      if (session) {
        setUser(session.user);
        setIsAdmin(session.user.user_metadata?.role === 'admin' ?? false);
        setupRefreshTimer(session.expires_in);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin' ?? false);
      setLoading(false);

      if (session) {
        setupRefreshTimer(session.expires_in);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [handleError]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.signIn');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.signOut');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.resetPassword');
      }
      throw error;
    }
  };

  const signInWithProvider = async (provider: 'google' | 'linkedin') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.signInWithProvider');
      }
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.verifyEmail');
      }
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof AuthError) {
        handleError(error, 'AuthContext.resendVerificationEmail');
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut, 
      resetPassword, 
      signInWithProvider,
      isAdmin,
      refreshSession,
      verifyEmail,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};