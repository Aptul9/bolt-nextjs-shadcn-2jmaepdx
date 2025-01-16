import { NextRequest, NextResponse } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Destructure the authenticated client
    const { supabase, tenantId } = authResult;

    const { searchParams } = request.nextUrl;
    const activeOnly = searchParams.get("activeOnly") === "true";

    // Build the query to count users
    let query = supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("tenantId", tenantId);

    // Apply active filters if activeOnly is true
    if (activeOnly) {
      query = query
        .eq("status", true)
        .gt("expiresAt", new Date().toISOString());
    }

    const { count, error } = await query;

    if (error) throw error;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error counting users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
