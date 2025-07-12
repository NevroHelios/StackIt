import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getAdminAnalytics, checkAdminAccess } from "@/lib/actions/admin.action";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | StackIt",
    description: "Comprehensive admin dashboard for StackIt platform management",
};

const AdminPage = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    // try {
    //     // Check if user has admin access
    //     await checkAdminAccess(userId);
    // } catch (error) {
    //     redirect("/");
    // }

    // Fetch all analytics data
    const analytics = await getAdminAnalytics();

    return <AdminDashboard analytics={analytics} />;
};

export default AdminPage;
