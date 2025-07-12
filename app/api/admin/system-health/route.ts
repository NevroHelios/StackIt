import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getSystemHealth } from "@/lib/actions/admin.action";

export async function GET(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const health = await getSystemHealth({
            adminClerkId: userId,
        });

        return NextResponse.json(health);
    } catch (error: any) {
        console.error("Error fetching system health:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch system health" },
            { status: 500 }
        );
    }
}
