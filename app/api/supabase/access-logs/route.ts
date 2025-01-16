import { NextResponse, NextRequest } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Destructure the authenticated client
    const { supabase, tenantId } = authResult

    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const countOnly = searchParams.get("countOnly") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 10;

    // Build the query using the authenticated supabase client
    let query = supabase
      .from("access_logs")
      .select(
        countOnly
          ? "id"
          : `
        id,
        timestamp,
        door,
        success,
        createdAt,
        user:users (
          id,
          name
        )
      `,
        { count: "exact" }
      )
      .eq("tenantId", tenantId);  // Using tenantId from auth

    if (userId) {
      query = query.eq("userId", userId);
    }

    if (startDate) {
      query = query.gte("timestamp", startDate);
    }

    if (endDate) {
      query = query.lte("timestamp", endDate);
    }

    if (countOnly) {
      const { count, error } = await query;
      if (error) {
        console.error("Error getting count:", error);
        return NextResponse.json(
          { error: messages.request.failed },
          { status: 500 }
        );
      }
      return NextResponse.json({ count }, { status: 200 });
    }

    const { data, error, count } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { error: messages.request.failed },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / perPage);

    const meta = {
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
      currentPage: page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      pageCount: totalPages,
      totalCount: count,
    };

    return NextResponse.json({ data, meta }, { status: 200 });
    
  } catch (error) {
    console.error("Error in access logs API:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}