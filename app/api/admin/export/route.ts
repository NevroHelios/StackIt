import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { exportPlatformData } from "@/lib/actions/admin.action";

export async function POST(request: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const dataType = searchParams.get("type") as "users" | "questions" | "answers" | "all" || "all";
        const format = searchParams.get("format") as "json" | "csv" || "json";

        const exportData = await exportPlatformData({
            adminClerkId: userId,
            dataType,
            format,
        });

        // Set appropriate headers for file download
        const headers = new Headers();
        headers.set("Content-Type", format === "json" ? "application/json" : "text/csv");
        headers.set("Content-Disposition", `attachment; filename="platform-data-${new Date().toISOString().split('T')[0]}.${format}"`);

        return new NextResponse(
            format === "json" ? JSON.stringify(exportData.data, null, 2) : exportData.data,
            { headers }
        );
    } catch (error: any) {
        console.error("Error exporting data:", error);
        return NextResponse.json(
            { error: error.message || "Failed to export data" },
            { status: 500 }
        );
    }
}
