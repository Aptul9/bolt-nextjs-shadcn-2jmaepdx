import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";


export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
        name: "Johnny Will-Schowalter",
        tenantId: "02905d6b-c765-41d2-9643-6d739ff83b39",
        subscriptionType: "Slots",
        expiresAt: "2025-05-21T12:55:52.466Z",
        remainingSlots: 81,
        status: true,
        createdAt: "2024-02-16T09:16:11.694Z",
        updatedAt: "2025-01-05T16:04:24.732Z",
        userInfo: {
          email: "Marcelle_Monahan@hotmail.com",
          phoneNumber: "(903) 939-8254 x0235"
        }
      }
    ],
    meta: {
      isFirstPage: true,
      isLastPage: true,
      currentPage: 1,
      previousPage: null,
      nextPage: null,
      pageCount: 1,
      totalCount: 1
    }
  });
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