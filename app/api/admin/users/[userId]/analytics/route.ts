import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getUserDetailedAnalytics } from "@/lib/actions/admin.action";

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId: adminId } = auth();

        if (!adminId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = params;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const result = await getUserDetailedAnalytics({
            userId,
            adminClerkId: adminId,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error fetching user analytics:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch user analytics" },
            { status: 500 }
        );
    }
}
