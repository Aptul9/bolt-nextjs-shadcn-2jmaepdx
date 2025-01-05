import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Extract query parameters
  const tenantId = searchParams.get("tenantId");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  // Configure pagination
  const pagination = {
    ...(limit && { limit: parseInt(limit, 10) }),
    ...(page && { page: parseInt(page, 10) }),
  };

  try {
    // Check if tenantId is provided
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    // Fetch data and meta with pagination
    const [data, meta] = await prisma.user
      .paginate({
        where: {
          tenantId: tenantId,
        },
        select: {
          id: true,
          name: true,
          tenantId: true,
          subscriptionType: true,
          expiresAt: true,
          remainingSlots: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          userInfo: {
            select: {
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      })
      .withPages(pagination);

    // Return the paginated data
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
    const {
      name,
      tenantId,
      subscriptionType,
      expiresAt,
      remainingSlots,
      status,
      userInfo,
    } = body;

    // Validate the required fields
    if (!name || !tenantId || !subscriptionType || !expiresAt) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, tenantId, subscriptionType, expiresAt",
        },
        { status: 400 }
      );
    }

    // Create a new user in the database with optional userInfo
    const newUser = await prisma.user.create({
      data: {
        name,
        tenantId,
        subscriptionType,
        expiresAt: new Date(expiresAt),
        remainingSlots: remainingSlots ?? null,
        status: status ?? true, // Default to true if not provided
        ...(userInfo && {
          userInfo: {
            create: {
              ...userInfo,
              tenantId, // Make sure to include tenantId in userInfo
            },
          },
        }),
      },
      include: {
        userInfo: true, // Include the created userInfo in the response
      },
    });

    // Return the created user
    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}