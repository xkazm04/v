import { Sidebar } from '@/app/components/sidebar/sidebar';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/app/components/ui/tabs';
import SetApearance from '../sections/settings/SetApearance';
import SetNotifications from '../sections/settings/SetNotifications';
import { ProfileSettings } from '@/app/components/profile/ProfileSettings';

export default function SettingsPage() {  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            
            <SetApearance />
            <SetNotifications />
          </Tabs>
        </div>
      </div>
    </div>
  );
}