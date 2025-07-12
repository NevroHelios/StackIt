import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { getAdminAnalytics } from "@/lib/actions/admin.action";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | StackIt",
};

const AdminDashboardPage = async () => {
    const { userId } = auth();
    if (!userId) redirect("/sign-in");

    const analytics = await getAdminAnalytics();

    return <AdminDashboard analytics={analytics} />;
};

export default AdminDashboardPage;
