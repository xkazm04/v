'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { Button } from '@/app/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/app/components/ui/radio-group';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Check, Moon, Sun, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [restricted, setRestricted] = useState(false);
  const [privacy, setPrivacy] = useState('public');
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={theme || 'system'} 
                    onValueChange={setTheme}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all duration-200"
                      >
                        <Sun className="h-6 w-6 mb-3" />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium leading-none">Light</p>
                          <p className="text-sm text-muted-foreground">
                            Clean, bright interface
                          </p>
                        </div>
                        {theme === 'light' && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="sr-only peer" 
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all duration-200"
                      >
                        <Moon className="h-6 w-6 mb-3" />
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium leading-none">Dark</p>
                          <p className="text-sm text-muted-foreground">
                            Easier on the eyes
                          </p>
                        </div>
                        {theme === 'dark' && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="playback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Playback Settings</CardTitle>
                  <CardDescription>
                    Customize how videos play on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoplay">Autoplay videos</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically play videos when the page loads
                      </p>
                    </div>
                    <Switch
                      id="autoplay"
                      checked={autoplay}
                      onCheckedChange={setAutoplay}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="restricted">Restricted mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Filter out potentially mature content
                      </p>
                    </div>
                    <Switch
                      id="restricted"
                      checked={restricted}
                      onCheckedChange={setRestricted}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage your privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="privacy-setting">Content visibility</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Choose who can see your uploaded content
                      </p>
                      <RadioGroup
                        id="privacy-setting"
                        value={privacy}
                        onValueChange={setPrivacy}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Public - Anyone can view</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unlisted" id="unlisted" />
                          <Label htmlFor="unlisted">Unlisted - Only accessible with link</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Private - Only you can view</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
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
                      onCheckedChange={setNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Save preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}