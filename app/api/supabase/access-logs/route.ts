import { NextResponse, NextRequest } from "next/server";
import messages from "@/constants/messages";
import { authenticateDevice, authenticateRequest } from "@/utils/auth";
import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "@/utils/supabase";
import type { User } from '@prisma/client';
import { checkAccess } from "@/utils/functions/checkAccess";

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

export async function POST(request: NextRequest) {
  try {
    const { accessKey, cardid, door } = await request.json();

    const tenantId = await authenticateDevice(accessKey);
    if (!tenantId) {
      return NextResponse.json({ error: messages.device.invalidKey }, { status: 401 });
    }

    // Type the Supabase response using 'as' assertion
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("cardid", cardid)
      .eq("tenantId", tenantId)
      .single() as { data: User | null; error: any };

    if (userError || !userData) {
      return NextResponse.json({ error: messages.request.notFound }, { status: 404 });
    }

    // Type assertion for user data
    const user = userData as User;
    const success = checkAccess(user);

    // Create access log with computed success status
    const { error } = await supabaseAdmin
      .from("access_logs")
      .insert([
        {
          id: uuidv4(),
          tenantId: userData.tenantId,
          userId: userData.id,
          door: door,
          success: success,
        },
      ]);

    if (error) {
      console.error("Error creating access log:", error);
      return NextResponse.json({ error: messages.request.failed }, { status: 500 });
    }

    return NextResponse.json({ result: success }, { status: 201 });
  } catch (error) {
    console.error("Error in access log creation API:", error);
    return NextResponse.json({ error, message: messages.request.failed }, { status: 500 });
  }
}