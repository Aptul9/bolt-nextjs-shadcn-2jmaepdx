import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const tenantId = searchParams.get("tenantId");
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const countOnly = searchParams.get("countOnly") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  try {
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
      .eq("tenantId", tenantId);

    if (userId) {
      query = query.eq("userId", userId);
    }

    if (startDate) {
      query = query.gte("timestamp", startDate);
    }

    if (endDate) {
      query = query.lte("timestamp", endDate);
    }

    // If countOnly, we just need the count
    if (countOnly) {
      const { count, error } = await query;
      if (error) throw error;
      return NextResponse.json({ count }, { status: 200 });
    }

    // Otherwise, get paginated data
    const { data, error, count } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order("timestamp", { ascending: false });

    if (error) throw error;

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
    console.error("Error fetching access logs:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
