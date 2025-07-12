import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { bulkDeleteUsers } from "@/lib/actions/admin.action";

export async function DELETE(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userIds } = await request.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json(
                { error: "User IDs array is required" },
                { status: 400 }
            );
        }

        const result = await bulkDeleteUsers({
            userIds,
            adminClerkId: userId,
            path: "/admin",
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error bulk deleting users:", error);
        return NextResponse.json(
            { error: error.message || "Failed to bulk delete users" },
            { status: 500 }
        );
    }
}
