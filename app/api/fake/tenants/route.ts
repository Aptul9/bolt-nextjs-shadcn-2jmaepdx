import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "02905d6b-c765-41d2-9643-6d739ff83b39",
        subscriptionType: "Standard",
        expiresAt: "2026-01-05T23:00:00.000Z",
        ownerId: "74c88d44-9fb6-4331-a40e-fa7ba4574b7c",
        createdAt: "2024-07-06T11:30:56.763Z",
        updatedAt: "2025-01-06T11:13:00.580Z"
      },
      {
        id: "de51a5d5-0648-484c-9a29-88b39c2b0080",
        subscriptionType: "Standard",
        expiresAt: "2026-01-05T23:00:00.000Z",
        ownerId: "6814eacd-c982-4bd6-bedf-7944fd300c3e",
        createdAt: "2024-10-16T21:58:21.887Z",
        updatedAt: "2025-01-05T14:05:30.470Z"
      }
    ],
    meta: {
      isFirstPage: true,
      isLastPage: true,
      currentPage: 1,
      previousPage: null,
      nextPage: null,
      pageCount: 1,
      totalCount: 2
    }
  });
}

// export async function POST(request: NextRequest) {
//   try {
//     // Log the request body to check if it's empty
//     const rawBody = await request.text();
//     console.log("Raw request body:", rawBody);

//     // Check if the request body is empty
//     if (!rawBody) {
//       return NextResponse.json(
//         { error: "Request body is empty" },
//         { status: 400 }
//       );
//     }

//     // Parse the body if it is not empty
//     const body = JSON.parse(rawBody);

//     // Extract parameters from the body
//     const { subscriptionType, expiresAt, ownerId } = body;

//     // Validate the required fields
//     if (!subscriptionType || !expiresAt || !ownerId) {
//       return NextResponse.json(
//         {
//           error:
//             "Missing required fields: subscriptionType, expiresAt, ownerId",
//         },
//         { status: 400 }
//       );
//     }

//     // Create a new tenant in the database
//     const newTenant = await prisma.tenant.create({
//       data: {
//         subscriptionType,
//         expiresAt: new Date(expiresAt),
//         ownerId,
//       },
//     });

//     // Return the created tenant
//     return NextResponse.json({ data: newTenant }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating tenant:", error);
//     return NextResponse.json(
//       { error, message: messages.request.failed },
//       { status: 500 }
//     );
//   }
// }
