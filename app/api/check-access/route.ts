import { NextResponse, NextRequest } from "next/server";
import { validateUserAccess } from "@/lib/api/access-validator";
import { logAccess } from "@/lib/api/access-logger";
import messages from "@/constants/messages";
import prisma from "@/lib/api/prisma";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const body = JSON.parse(rawBody);
    const { userId, tenantId, door } = body;

    // Validate required fields
    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, tenantId" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Validate access
      const validation = await validateUserAccess(userId, tenantId);

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          status: 403,
        };
      }

      // If user has remaining slots, decrement it
    //   const user = await tx.user.findUnique({
    //     where: { id: userId, tenantId: tenantId },
    //   });
      if (
        validation?.remainingSlots !== undefined &&
        validation.remainingSlots !== null &&
        validation.remainingSlots > 0
      ) {
        await tx.user.update({
          where: { id: userId },
          data: { remainingSlots: validation.remainingSlots - 1 },
        });
      }

      // Log the access
      const accessLog = await logAccess(userId, tenantId, door);

      return {
        success: true,
        data: accessLog,
        status: 200,
      };
    });

    return NextResponse.json(
      result.success ? { data: result.data } : { error: result.error },
      { status: result.status }
    );
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
