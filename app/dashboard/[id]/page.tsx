import DashboardLayout from "@/app/sections/dashboard/DashboardLayout";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { id } = params;

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout profileId={id} />
    </div>
  );
};

export default ProfilePage;

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = params;

  return {
    title: `Profile Dashboard - ${id}`,
    description: `View profile information and fact-check statistics for profile ${id}`,
  };
}