import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/utils/supabase";
import messages from "@/constants/messages";
import { addDays } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tenantId = searchParams.get("tenantId");
  const status = searchParams.get("status");
  const expiringOnly = searchParams.get("expiringOnly");
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

    // Start building the query
    let query = supabase
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
      .eq('tenantId', tenantId);

    // Add status filter if provided
    if (status !== null) {
      query = query.eq('status', status === 'true');
    }

    // Add expiring soon filter if enabled
    if (expiringOnly === 'true') {
      const oneWeekFromNow = addDays(new Date(), 7);
      query = query.lte('expiresAt', oneWeekFromNow.toISOString());
      query = query.gte('expiresAt', new Date().toISOString());
    }

    // Add pagination and ordering
    const { data, error } = await query
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