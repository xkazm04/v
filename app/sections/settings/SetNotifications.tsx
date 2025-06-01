'use client';
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/app/components/ui/card';
import {
  TabsContent,
} from '@/app/components/ui/tabs';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/hooks/useAuth';
import { updateUserProfile } from '@/app/lib/database';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const SetNotifications = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize notifications state from profile
  useEffect(() => {
    if (profile) {
      setNotifications(profile.notifications);
    }
  }, [profile]);

  const handleNotificationChange = (checked: boolean) => {
    setNotifications(checked);
    setHasUnsavedChanges(profile ? checked !== profile.notifications : false);
  };

  const handleSavePreferences = async () => {
    if (!user || !profile) {
      toast.error('Please sign in to save preferences');
      return;
    }

    try {
      setIsUpdating(true);
      
      const updatedProfile = await updateUserProfile(user.id, { 
        notifications 
      });
      
      if (updatedProfile) {
        await refreshProfile();
        setHasUnsavedChanges(false);
        toast.success('Notification preferences saved successfully');
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TabsContent value="notifications" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about new content and interactions
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationChange}
              disabled={!user || isUpdating}
            />
          </div>

          {/* Additional notification settings can be added here */}
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">What you&apos;ll receive</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• New fact-check results</li>
                <li>• Content verification updates</li>
                <li>• Weekly summary reports</li>
                <li>• Important security notifications</li>
              </ul>
            </div>
          </div>

          {!user && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                Please sign in to manage your notification preferences
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSavePreferences}
            disabled={!user || !hasUnsavedChanges || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save preferences
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default SetNotifications;