import { NextRequest, NextResponse } from "next/server";
import messages from "@/constants/messages";
import { authenticateRequest } from "@/utils/auth";

type HandlerArgs = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, args: HandlerArgs) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Destructure the authenticated client
    const { supabase, tenantId } = authResult;
    const { id } = await args.params;

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        subscriptionType,
        status,
        expiresAt,
        remainingSlots,
        userInfo:users_info (
          email,
          phoneNumber,
          address,
          birthDate,
          birthPlace,
          nationality,
          gender,
          emergencyContact,
          notes
        )
      `
      )
      .eq("id", id)
      .eq("tenantId", tenantId)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { message: messages.request.notFound },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, args: HandlerArgs) {
  try {
    // Authenticate the request
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Destructure the authenticated client
    const { supabase, tenantId } = authResult;
    const { id } = await args.params;
    const body = await request.json();

    const { name, subscriptionType, status, expiresAt, remainingSlots } = body;

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        subscriptionType,
        status,
        expiresAt,
        remainingSlots,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("tenantId", tenantId)
      .select(
        `
        id,
        name,
        subscriptionType,
        status,
        expiresAt,
        remainingSlots,
        userInfo:users_info (
          email,
          phoneNumber,
          address,
          birthDate,
          birthPlace,
          nationality,
          gender,
          emergencyContact,
          notes
        )
      `
      )
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
