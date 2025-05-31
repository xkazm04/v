'use client';
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
import { useState } from 'react';
const SetNotifications = () => {
     const [notifications, setNotifications] = useState(true);
    return <TabsContent value="notifications" className="space-y-4">
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
}

export default SetNotifications;