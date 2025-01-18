import { NextResponse, NextRequest } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { supabase, tenantId } = authResult;

    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const perPage = 10;

    let query = supabase
      .from("access_logs")
      .select(
        `
        id,
        timestamp,
        door,
        success,
        createdAt,
        user:users (
          id,
          name
        )
      `
      )
      .eq("tenantId", tenantId);

    if (userId) query = query.eq("userId", userId);
    if (startDate) query = query.gte("timestamp", startDate);
    if (endDate) query = query.lte("timestamp", endDate);

    const { data, error } = await query
      .order("timestamp", { ascending: false })
      .range((page - 1) * perPage, page * perPage);

    if (error) {
      console.error("Error fetching logs:", error);
      return NextResponse.json({ error: messages.request.failed }, { status: 500 });
    }

    const hasNextPage = data.length > perPage;
    const logs = hasNextPage ? data.slice(0, perPage) : data;

    const meta = {
      hasNextPage,
      currentPage: page,
      previousPage: page > 1 ? page - 1 : null,
    };

    return NextResponse.json({ data: logs, meta }, { status: 200 });
  } catch (error) {
    console.error("Error in access logs API:", error);
    return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
  }
}
