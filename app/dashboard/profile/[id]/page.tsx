import ProfileDashboard from "@/app/sections/dashboard/ProfileDashboard";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileDashboard profileId={id} />
    </div>
  );
};

export default ProfilePage;

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  
  return {
    title: `Profile Dashboard - ${id}`,
    description: `View profile information and fact-check statistics for profile ${id}`,
  };
}