import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const searchText = searchParams.get("q");
  const tenantId = searchParams.get("tenantId");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  try {
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

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
      { error: error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
