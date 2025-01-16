import { NextResponse, NextRequest } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";
import { addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

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
    const status = searchParams.get("status");
    const expiringOnly = searchParams.get("expiringOnly");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 10;

    // Get total count
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("tenantId", tenantId);

    // Start building the query
    let query = supabase
      .from("users")
      .select(
        `
        id,
        name,
        tenantId,
        subscriptionType,
        expiresAt,
        remainingSlots,
        status,
        createdAt,
        updatedAt
      `
      )
      .eq("tenantId", tenantId);

    // Add status filter if provided
    if (status !== null) {
      query = query.eq("status", status === "true");
    }

    // Add expiring soon filter if enabled
    if (expiringOnly === "true") {
      const oneWeekFromNow = addDays(new Date(), 7);
      query = query.lte("expiresAt", oneWeekFromNow.toISOString());
      query = query.gte("expiresAt", new Date().toISOString());
    }

    // Add pagination and ordering
    const { data, error } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order("createdAt", { ascending: true });

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
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Destructure the authenticated client
    const { supabase, tenantId } = authResult;

    const body = await request.json();
    const {
      name,
      subscriptionType,
      status,
      expiresAt,
      remainingSlots,
      userInfo,
    } = body;

    // Validate required fields
    if (!name || !subscriptionType || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields: name, subscriptionType, expiresAt" },
        { status: 400 }
      );
    }

    // Generate a new UUID for the user
    const userId = uuidv4();

    // Start a transaction using supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          name,
          tenantId,
          subscriptionType,
          status: status ?? true,
          expiresAt: new Date(expiresAt).toISOString(),
          remainingSlots: subscriptionType === "Slots" ? remainingSlots : null,
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (userError) throw userError;

    if (userInfo) {
      const { error: userInfoError } = await supabase
        .from("users_info")
        .insert([
          {
            userId: userId,
            tenantId,
            ...userInfo,
            updatedAt: new Date().toISOString(),
          },
        ]);
      if (userInfoError) throw userInfoError;
    }

    return NextResponse.json({ userId: userId }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}