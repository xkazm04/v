'use client';
import { useState, useEffect } from 'react';
import { Check, Moon, Sun, Monitor } from 'lucide-react';
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
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/app/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { useAuth } from '@/app/hooks/useAuth';
import { updateUserProfile } from '@/app/lib/database';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { ColorSubtoneSelector } from './ColorSubtoneSelector';
import { toast } from 'sonner';

const SetApearance = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, refreshProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean, bright interface',
      icon: Sun
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easier on the eyes',
      icon: Moon
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor
    }
  ];

  // Sync theme changes with user profile
  useEffect(() => {
    if (profile && theme && theme !== profile.theme) {
      handleThemeUpdate(theme as 'light' | 'dark' | 'system');
    }
  }, [theme, profile]);

  const handleThemeUpdate = async (newTheme: 'light' | 'dark' | 'system') => {
    if (!user || !profile || isUpdating) return;

    try {
      setIsUpdating(true);
      const updatedProfile = await updateUserProfile(user.id, { theme: newTheme });
      
      if (updatedProfile) {
        await refreshProfile();
        toast.success('Theme updated successfully');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // The useEffect will handle the profile update
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
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Theme Mode</h4>
            <RadioGroup
              value={theme || 'system'}
              onValueChange={handleThemeChange}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              disabled={isUpdating}
            >
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                
                return (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`theme-${option.value}`}
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={`theme-${option.value}`}
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all duration-200 h-32"
                    >
                      <Icon className="h-6 w-6 mb-3" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium leading-none">{option.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

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