'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { toast } from 'sonner';
import { cn } from '@/app/lib/utils';

interface AuthButtonsProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  layout?: 'horizontal' | 'vertical';
  showIcons?: boolean;
}

export function AuthButtons({ 
  className = '', 
  variant = 'outline',
  size = 'default',
  layout = 'horizontal',
  showIcons = true
}: AuthButtonsProps) {
  const { user, loading, signInWithGoogle, signInWithTwitter, signOut, error } = useAuth();
  const { colors, mounted, isDark } = useLayoutTheme();
  const [authLoading, setAuthLoading] = useState<'google' | 'twitter' | 'signout' | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading('google');
      await signInWithGoogle();
      toast.success('Signed in with Google successfully');
    } catch (err) {
      toast.error('Failed to sign in with Google');
    } finally {
      setAuthLoading(null);
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      setAuthLoading('twitter');
      await signInWithTwitter();
      toast.success('Signed in with X successfully');
    } catch (err) {
      toast.error('Failed to sign in with X');
    } finally {
      setAuthLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading('signout');
      await signOut();
      toast.success('Signed out successfully');
    } catch (err) {
      toast.error('Failed to sign out');
    } finally {
      setAuthLoading(null);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant={variant} 
          size={size} 
          disabled 
          className={cn("transition-all duration-200", className)}
          style={{
            backgroundColor: colors.muted,
            color: colors.mutedForeground,
            borderColor: colors.border
          }}
        >
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </Button>
      </motion.div>
    );
  }

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleSignOut}
          disabled={authLoading === 'signout'}
          className={cn(
            "transition-all duration-200 hover:scale-105 active:scale-95",
            className
          )}
          style={{
            backgroundColor: variant === 'default' ? colors.primary : 'transparent',
            color: variant === 'default' ? colors.background : colors.foreground,
            borderColor: colors.border
          }}
        >
          {authLoading === 'signout' && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Sign Out
        </Button>
      </motion.div>
    );
  }

  const buttonBaseStyle = {
    backgroundColor: variant === 'default' ? colors.primary : 'transparent',
    color: variant === 'default' ? colors.background : colors.foreground,
    borderColor: colors.border
  };

  const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const XIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <motion.div 
      className={cn(
        "flex gap-2",
        layout === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
    >
      {/* Google Sign In */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleGoogleSignIn}
          disabled={authLoading === 'google'}
          className={cn(
            "flex items-center gap-2 transition-all duration-200 relative overflow-hidden group",
            layout === 'vertical' && 'w-full justify-center'
          )}
          style={buttonBaseStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.muted;
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}25`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonBaseStyle.backgroundColor;
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}10, ${colors.accent}05)`
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            {authLoading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              showIcons && <GoogleIcon />
            )}
            <span>Google</span>
          </div>
        </Button>
      </motion.div>

      {/* X (Twitter) Sign In */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleTwitterSignIn}
          disabled={authLoading === 'twitter'}
          className={cn(
            "flex items-center gap-2 transition-all duration-200 relative overflow-hidden group",
            layout === 'vertical' && 'w-full justify-center'
          )}
          style={buttonBaseStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.muted;
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}25`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonBaseStyle.backgroundColor;
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}10, ${colors.accent}05)`
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            {authLoading === 'twitter' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              showIcons && <XIcon />
            )}
            <span>X (Twitter)</span>
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
}