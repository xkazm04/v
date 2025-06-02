'use client';

import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, MapPin, Building, Calendar, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileDashboardProps {
  profileId: string;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ profileId }) => {
  const { profile, isLoading, error, isError, refetch } = useProfile(profileId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-600 text-lg font-semibold">
                {error || 'Profile not found'}
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} alt={profile.name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Profile ID: {profile.id}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.country && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.country.toUpperCase()}
                  </Badge>
                )}
                {profile.party && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {profile.party}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile.total_statements ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Fact-checked statements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(profile.created_at)}
            </div>
            <p className="text-xs text-muted-foreground">
              First recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(profile.updated_at)}
            </div>
            <p className="text-xs text-muted-foreground">
              Profile modified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Statement history will be displayed here</p>
            <p className="text-sm">Coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDashboard;