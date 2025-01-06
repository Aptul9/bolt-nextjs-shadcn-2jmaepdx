import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

// export async function GET(request: NextRequest) {
//   const { searchParams } = request.nextUrl;

//   // Extract query parameters
//   const tenantId = searchParams.get("tenantId");
//   const userId = searchParams.get("userId");
//   const limit = searchParams.get("limit");
//   const page = searchParams.get("page");

//   // Configure pagination
//   const pagination = {
//     ...(limit && { limit: parseInt(limit, 10) }),
//     ...(page && { page: parseInt(page, 10) }),
//   };

//   try {
//     // Check if tenantId is provided
//     if (!tenantId) {
//       return NextResponse.json(
//         { error: "tenantId is required" },
//         { status: 400 }
//       );
//     }

//     // Configure filtering logic
//     const where = {
//       tenantId,
//       ...(userId && { userId }),
//     };

//     // Fetch data and meta with pagination
//     const [data, meta] = await prisma.userInfo
//       .paginate({
//         where,
//         select: {
//           userId: true,
//           tenantId: true,
//           birthDate: true,
//           address: true,
//           email: true,
//           phoneNumber: true,
//           birthPlace: true,
//           ssn: true,
//           nationality: true,
//           gender: true,
//           emergencyContact: true,
//           notes: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//         orderBy: { createdAt: "desc" },
//       })
//       .withPages(pagination);

//     // Return the paginated data
//     return NextResponse.json({ data, meta }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     return NextResponse.json(
//       { error, message: messages.request.failed },
//       { status: 500 }
//     );
//   }
// }

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
//     const {
//       userId,
//       tenantId,
//       birthDate,
//       address,
//       email,
//       phoneNumber,
//       birthPlace,
//       ssn,
//       nationality,
//       gender,
//       emergencyContact,
//       notes,
//     } = body;

//     // Validate the required fields
//     if (!userId || !tenantId) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields: userId, tenantId",
//         },
//         { status: 400 }
//       );
//     }

//     // Create a new user info in the database
//     const newUserInfo = await prisma.userInfo.create({
//       data: {
//         userId,
//         tenantId,
//         birthDate: birthDate ? new Date(birthDate) : null,
//         address,
//         email,
//         phoneNumber,
//         birthPlace,
//         ssn,
//         nationality,
//         gender,
//         emergencyContact,
//         notes,
//       },
//     });

//     // Return the created user info
//     return NextResponse.json({ data: newUserInfo }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating user info:", error);
//     return NextResponse.json(
//       { error, message: messages.request.failed },
//       { status: 500 }
//     );
//   }
// }