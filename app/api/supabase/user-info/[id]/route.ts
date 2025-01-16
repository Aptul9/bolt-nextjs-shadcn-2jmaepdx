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
      .from("users_info")
      .select(
        `
        userId,
        birthDate,
        address,
        email,
        phoneNumber,
        birthPlace,
        ssn,
        nationality,
        gender,
        emergencyContact,
        notes,
        createdAt,
        updatedAt
      `
      )
      .eq("userId", id)
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
    console.error("Error fetching user info:", error);
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
    const {
      email,
      phoneNumber,
      address,
      birthDate,
      birthPlace,
      nationality,
      gender,
      emergencyContact,
      notes,
    } = body;

    const { data, error } = await supabase
      .from("users_info")
      .update({
        email,
        phoneNumber,
        address,
        birthDate,
        birthPlace,
        nationality,
        gender,
        emergencyContact,
        notes,
        updatedAt: new Date().toISOString(),
      })
      .eq("userId", id)
      .eq("tenantId", tenantId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating user info:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
