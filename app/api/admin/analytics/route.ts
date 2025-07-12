import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getAdminAnalytics } from "@/lib/actions/admin.action";

export async function GET(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const analytics = await getAdminAnalytics();

        return NextResponse.json(analytics);
    } catch (error: any) {
        console.error("Error fetching admin analytics:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
