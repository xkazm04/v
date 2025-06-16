import { use } from 'react';
import DashboardLayout from "@/app/sections/dashboard/DashboardLayout";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout profileId={id} />
    </div>
  );
};
export default ProfilePage;

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  
  return {
    title: `Profile Dashboard - ${id}`,
    description: `View profile information and fact-check statistics for profile ${id}`,
  };
}