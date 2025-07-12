import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getAdminUsers, adminDeleteUser, getUserDetailedAnalytics } from "@/lib/actions/admin.action";

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
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "20");
        const searchQuery = searchParams.get("searchQuery") || "";
        const sortBy = searchParams.get("sortBy") || "newest";

        const result = await getAdminUsers({
            page,
            pageSize,
            searchQuery,
            sortBy,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error fetching admin users:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userIdToDelete } = await request.json();

        if (!userIdToDelete) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const result = await adminDeleteUser({
            userId: userIdToDelete,
            adminClerkId: userId,
            path: "/admin",
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete user" },
            { status: 500 }
        );
    }
}
