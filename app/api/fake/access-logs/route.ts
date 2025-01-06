import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "8ce84f37-ec08-4c37-a18d-85290ed13262",
        timestamp: "2025-01-06T06:54:33.795Z",
        door: 4,
        createdAt: "2025-01-05T22:39:16.476Z",
        user: {
          id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
          name: "Johnny Will-Schowalter",
          subscriptionType: "Slots",
          status: true,
          userInfo: {
            email: "Marcelle_Monahan@hotmail.com",
            phoneNumber: "(903) 939-8254 x0235",
          },
        },
      },
      {
        id: "3fb74971-1fe3-48d0-b140-121a8ad129b4",
        timestamp: "2025-01-06T02:08:32.557Z",
        door: 4,
        createdAt: "2025-01-05T13:33:06.710Z",
        user: {
          id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
          name: "Johnny Will-Schowalter",
          subscriptionType: "Slots",
          status: true,
          userInfo: {
            email: "Marcelle_Monahan@hotmail.com",
            phoneNumber: "(903) 939-8254 x0235",
          },
        },
      },
      {
        id: "a70073cb-49f9-4137-a363-3231ce67c340",
        timestamp: "2025-01-05T21:28:14.521Z",
        door: 10,
        createdAt: "2025-01-06T00:24:43.177Z",
        user: {
          id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
          name: "Johnny Will-Schowalter",
          subscriptionType: "Slots",
          status: true,
          userInfo: {
            email: "Marcelle_Monahan@hotmail.com",
            phoneNumber: "(903) 939-8254 x0235",
          },
        },
      },
      {
        id: "22de6ddd-b168-44c6-b1ef-b5194b36975a",
        timestamp: "2025-01-05T20:17:05.838Z",
        door: 1,
        createdAt: "2025-01-06T04:15:01.044Z",
        user: {
          id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
          name: "Johnny Will-Schowalter",
          subscriptionType: "Slots",
          status: true,
          userInfo: {
            email: "Marcelle_Monahan@hotmail.com",
            phoneNumber: "(903) 939-8254 x0235",
          },
        },
      },
      {
        id: "f848d454-f05b-4416-8566-a4bdf722cd41",
        timestamp: "2025-01-05T15:05:48.968Z",
        door: 7,
        createdAt: "2025-01-05T12:24:15.406Z",
        user: {
          id: "27eb6eae-f098-43b5-ac76-56902635fe2e",
          name: "Johnny Will-Schowalter",
          subscriptionType: "Slots",
          status: true,
          userInfo: {
            email: "Marcelle_Monahan@hotmail.com",
            phoneNumber: "(903) 939-8254 x0235",
          },
        },
      },
    ],
    meta: {
      isFirstPage: true,
      isLastPage: true,
      currentPage: 1,
      previousPage: null,
      nextPage: null,
      pageCount: 1,
      totalCount: 5,
    },
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
