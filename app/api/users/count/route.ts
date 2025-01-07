import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tenantId = searchParams.get("tenantId");

  try {
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const count = await prisma.user.count({
      where: {
        tenantId,
        status: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error counting active users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}

//response: {"count":1}