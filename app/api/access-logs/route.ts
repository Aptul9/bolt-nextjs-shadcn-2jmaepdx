import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Extract query parameters
  const tenantId = searchParams.get("tenantId");
  const userId = searchParams.get("userId");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  // Configure pagination
  const pagination = {
    ...(limit && { limit: parseInt(limit, 10) }),
    ...(page && { page: parseInt(page, 10) }),
  };

  try {
    // Configure filtering logic
    const where = {
      ...(tenantId && { tenantId }),
      ...(userId && { userId }),
    };

    // Fetch data and meta with pagination
    const [data, meta] = await prisma.accessLog
      .paginate({
        where,
        select: {
          id: true,
          timestamp: true,
          tenantId: true,
          userId: true,
          door: true,
          createdAt: true,
        },
        orderBy: { timestamp: "desc" }, // Most recent first
      })
      .withPages(pagination);

    // Return the paginated data
    return NextResponse.json({ data, meta }, { status: 200 });
  } catch (error) {
    console.error("Error fetching access logs:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log the request body to check if it's empty
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    // Check if the request body is empty
    if (!rawBody) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    // Parse the body if it is not empty
    const body = JSON.parse(rawBody);

    // Extract parameters from the body
    const { tenantId, userId, door } = body;

    // Validate the required fields
    if (!tenantId || !userId) {
      return NextResponse.json(
        {
          error: "Missing required fields: tenantId, userId",
        },
        { status: 400 }
      );
    }

    // Create a new access log in the database
    const newAccessLog = await prisma.accessLog.create({
      data: {
        tenantId,
        userId,
        door,
        timestamp: new Date(), // Current timestamp
      },
    });

    // Return the created access log
    return NextResponse.json({ data: newAccessLog }, { status: 201 });
  } catch (error) {
    console.error("Error creating access log:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}