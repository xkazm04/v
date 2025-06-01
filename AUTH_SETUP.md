# Authentication & Profile System Setup Guide

## 🎯 Overview
Complete user authentication and profile management system using Supabase OAuth with Google and Twitter/X providers.

## 📋 Setup Checklist

### ✅ **Environment Configuration**
1. Add to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### ✅ **Supabase Database Setup**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase-schema.sql`
4. This creates:
   - `user_profiles` table with RLS policies
   - Automatic triggers for `updated_at`
   - Proper indexes for performance

### ✅ **OAuth Provider Configuration**
1. **Google OAuth:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google Client ID and Secret
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

2. **Twitter/X OAuth:**
   - Enable Twitter provider in Supabase
   - Add your Twitter API keys
   - Same redirect URI as above

## 🚀 **Features Implemented**

### Authentication Components
- `AuthButtons` - OAuth sign-in with Google and Twitter/X
- `AuthCallback` - Handles OAuth redirects with proper error handling
- `useAuth` hook - Complete authentication state management

### Profile Management
- `ProfileSettings` - User profile editing interface
- Database functions for CRUD operations
- Automatic profile creation on first sign-in

### Settings Integration
- **Profile Tab** - Basic information and preferences
- **Appearance Tab** - Theme preferences synced with user profile
- **Notifications Tab** - Email notification preferences

### Navigation Integration
- Authentication status in navbar
- User profile display when signed in
- Conditional action buttons for authenticated users

## 🔧 **Usage Examples**

### Using the Auth Hook
```tsx
import { useAuth } from '@/app/hooks/useAuth';

function MyComponent() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {profile?.full_name || user.email}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}
```

### Adding Auth Buttons Anywhere
```tsx
import { AuthButtons } from '@/app/components/auth/AuthButtons';

// In any component
<AuthButtons variant="outline" size="sm" />
```

### Using Profile Settings
```tsx
import { ProfileSettings } from '@/app/components/profile/ProfileSettings';

// In settings page or modal
<ProfileSettings className="max-w-2xl" />
```

## 🔐 **Security Features**

### Row Level Security (RLS)
- Users can only access their own profile data
- Automatic policy enforcement on all operations
- Service role bypass for admin operations

### Data Validation
- TypeScript interfaces for type safety
- Server-side validation in API routes
- Client-side form validation

### Authentication Flow
- Secure OAuth flow with proper redirects
- Session management with auto-refresh
- Error handling for failed auth attempts

## 📱 **Mobile Responsiveness**
- Mobile-optimized auth buttons
- Responsive profile settings forms
- Adaptive navigation based on screen size

## 🎨 **Theme Integration**
- User theme preferences stored in profile
- Automatic sync across devices
- System theme detection support

## 🔄 **State Management**
- Centralized auth context with React Context
- Automatic profile loading and caching
- Real-time auth state updates

## 🚨 **Error Handling**
- Comprehensive error boundaries
- User-friendly error messages
- Fallback states for loading/error conditions

## 📊 **Performance Optimizations**
- Optimistic updates for better UX
- Efficient re-renders with proper dependencies
- Database indexes for fast queries

## 🧪 **Testing Considerations**
- Mock auth context for testing
- API route testing with proper auth headers
- Component testing with auth states

## 🔮 **Future Enhancements**
- Email/password authentication
- Multi-factor authentication
- User avatar uploads
- Activity logging
- Admin dashboard

## 🐛 **Troubleshooting**

### Common Issues
1. **OAuth not working**: Check redirect URIs in provider settings
2. **Profile not creating**: Verify RLS policies are correctly applied
3. **Theme not syncing**: Ensure user is authenticated and profile exists

### Debug Tips
- Check browser console for auth errors
- Verify Supabase environment variables
- Test database queries in Supabase SQL editor

## 📞 **Support**
- Check Supabase documentation for provider-specific setup
- Use browser dev tools to debug auth flows
- Monitor Supabase logs for server-side issues