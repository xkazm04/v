import DashboardLayout from "../sections/dashboard/DashboardLayout";
import ProfilesExperimental from "../sections/dashboard/Profiles/ProfilesExperimental";

const Page = () => {
    return <>
    <ProfilesExperimental />
    <div className="flex flex-row justify-center py-2">Playground - Final components will be migrated to /dashboard/:id route</div>
        <DashboardLayout />
    </>
}

export default Page;