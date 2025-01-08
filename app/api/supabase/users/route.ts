import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
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

    // Get total count
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenantId', tenantId);

    // Get paginated data
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        tenantId,
        subscriptionType,
        expiresAt,
        remainingSlots,
        status,
        createdAt,
        updatedAt,
        userInfo:users_info (
          email,
          phoneNumber
        )
      `)
      .eq('tenantId', tenantId)
      .range((page - 1) * perPage, page * perPage - 1)
      .order('createdAt', { ascending: true });

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
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}