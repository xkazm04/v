import { Sidebar } from '@/app/components/sidebar/sidebar';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import SetApearance from '../sections/settings/SetApearance';
import SetNotifications from '../sections/settings/SetNotifications';

export default function SettingsPage() {  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <SetApearance />
            <SetNotifications />
          </Tabs>
        </div>
      </div>
    </div>
  );
}