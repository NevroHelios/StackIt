import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { getAdminAnswers, adminDeleteAnswer } from "@/lib/actions/admin.action";

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

        const result = await getAdminAnswers({
            page,
            pageSize,
            searchQuery,
            sortBy,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error fetching admin answers:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch answers" },
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

        const { answerId } = await request.json();

        if (!answerId) {
            return NextResponse.json(
                { error: "Answer ID is required" },
                { status: 400 }
            );
        }

        const result = await adminDeleteAnswer({
            answerId,
            adminClerkId: userId,
            path: "/admin",
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting answer:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete answer" },
            { status: 500 }
        );
    }
}
