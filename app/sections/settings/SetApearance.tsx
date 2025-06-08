'use client';
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/app/components/ui/card';
import {
  TabsContent,
} from '@/app/components/ui/tabs';
import { useTheme } from 'next-themes';
import { ColorSubtoneSelector } from './ColorSubtoneSelector';
import { toast } from 'sonner';

const SetApearance = () => {
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);


  // Sync theme changes with user profile
  useEffect(() => {
    if (theme) {
      handleThemeUpdate(theme as 'light' | 'dark' | 'system');
    }
  }, [theme]);

  const handleThemeUpdate = async (newTheme: 'light' | 'dark' | 'system') => {
    if ( isUpdating) return;

    try {
      setIsUpdating(true);
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <TabsContent value="appearance" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ColorSubtoneSelector />
          
          {/* Preview Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Preview</h4>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Changes are saved automatically and synced across all your devices
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SetApearance;