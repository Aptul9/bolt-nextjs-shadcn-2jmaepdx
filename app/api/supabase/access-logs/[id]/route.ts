import { NextRequest, NextResponse } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";

type HandlerArgs = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, args: HandlerArgs) {
  try {
    // Get the user ID from the route params
    const { id } = await args.params;

    // Authenticate the request
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { supabase, tenantId } = authResult

    // Query access logs using the authenticated client
    const { data, error } = await supabase
      .from("access_logs")
      .select(`
        id,
        timestamp,
        door,
        success
      `)
      .eq("userId", id)
      .eq("tenantId", tenantId)  // Using tenantId from auth
      .order("timestamp", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching user access logs:", error);
      return NextResponse.json(
        { error: messages.request.failed },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error in user access logs API:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}