import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getDetailedAnalytics } from "@/lib/actions/admin.action";

export async function GET(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get("timeRange") as "7d" | "30d" | "90d" | "1y" || "30d";

        const analytics = await getDetailedAnalytics({
            adminClerkId: userId,
            timeRange,
        });

        return NextResponse.json(analytics);
    } catch (error: any) {
        console.error("Error fetching detailed analytics:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch detailed analytics" },
            { status: 500 }
        );
    }
}
