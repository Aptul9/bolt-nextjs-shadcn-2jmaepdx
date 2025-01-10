import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tenantId = searchParams.get("tenantId");
  const activeOnly = searchParams.get("activeOnly") === "true";
  
  try {
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    let query = supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tenantId', tenantId);

    // Only apply active filters if activeOnly is true
    if (activeOnly) {
      query = query
        .eq('status', true)
        .gt('expiresAt', new Date().toISOString());
    }

    const { count, error } = await query;

    if (error) throw error;
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error counting users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}