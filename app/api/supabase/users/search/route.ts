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

    const query = supabase
      .from('users')
      .select(`
        id,
        name,
        status,
        subscriptionType,
        userInfo:users_info (
          email,
          phoneNumber
        )
      `)
      .eq('tenantId', tenantId)
      .or(`name.ilike.%${searchText}%,users_info.email.ilike.%${searchText}%,users_info.phoneNumber.ilike.%${searchText}%`)
      .range((page - 1) * perPage, page * perPage - 1)
      .order('name');

    const { data, error, count } = await query;

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / perPage);

    const meta = {
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
      currentPage: page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      pageCount: totalPages,
      totalCount: count
    };

    return NextResponse.json({ data, meta }, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}