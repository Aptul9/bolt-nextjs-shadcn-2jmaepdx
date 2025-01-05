import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Extract query parameters
  const filter = searchParams.get("filter");
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
      ...(filter && { subscriptionType: filter }), // Example filter for subscriptionType
    };

    // Fetch data and meta with pagination
    const [data, meta] = await prisma.tenant
      .paginate({
        select: {
          id: true,
          subscriptionType: true,
          expiresAt: true,
          ownerId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "asc" }, // Ordering by creation date
      })
      .withPages(pagination);

    // Return the paginated data
    return NextResponse.json({ data, meta }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tenants:", error);
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
    const { subscriptionType, expiresAt, ownerId } = body;

    // Validate the required fields
    if (!subscriptionType || !expiresAt || !ownerId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: subscriptionType, expiresAt, ownerId",
        },
        { status: 400 }
      );
    }

    // Create a new tenant in the database
    const newTenant = await prisma.tenant.create({
      data: {
        subscriptionType,
        expiresAt: new Date(expiresAt),
        ownerId,
      },
    });

    // Return the created tenant
    return NextResponse.json({ data: newTenant }, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}
