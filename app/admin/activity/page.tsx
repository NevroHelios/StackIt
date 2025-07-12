import RecentActivity from "@/components/admin/RecentActivity";
import { getAdminAnalytics } from "@/lib/actions/admin.action";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Recent Activity | Admin",
};

const ActivityPage = async () => {
    const { userId } = auth();
    if (!userId) redirect("/sign-in");

    const { recentActivity } = await getAdminAnalytics();

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Recent Activity</h1>
            <div className="mt-8">
                <RecentActivity activities={recentActivity} />
            </div>
        </div>
    );
};

export default ActivityPage; 