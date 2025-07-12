import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { getAdminAnalytics } from "@/lib/actions/admin.action";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Analytics | Admin",
};

const AnalyticsPage = async () => {
    const { userId } = auth();
    if (!userId) redirect("/sign-in");

    const { growthData } = await getAdminAnalytics();

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Analytics</h1>
      <div className="mt-8">
        <AnalyticsCharts growthData={growthData} />
      </div>
    </div>
  );
};

export default AnalyticsPage; 