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
    const searchText = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 10;

    if (!searchText) {
      return NextResponse.json(
        { error: "Search text is required" },
        { status: 400 }
      );
    }

    // Filter primary users table by name
    const {
      data: userData,
      error: userError,
      count,
    } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        status,
        subscriptionType
      `,
        { count: "exact" }
      )
      .eq("tenantId", tenantId)
      .ilike("name", `%${searchText}%`)
      .range((page - 1) * perPage, page * perPage - 1)
      .order("name");

    if (userError) throw userError;

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

    return NextResponse.json({ data: userData, meta }, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
