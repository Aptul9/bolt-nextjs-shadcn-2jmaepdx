import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/api/prisma";
import messages from "@/constants/messages";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const searchText = searchParams.get("q");
  const tenantId = searchParams.get("tenantId");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  const pagination = {
    ...(limit && { limit: parseInt(limit, 10) }),
    ...(page && { page: parseInt(page, 10) }),
  };

  try {
    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    if (!searchText) {
      return NextResponse.json(
        { error: "Search text is required" },
        { status: 400 }
      );
    }

    const [data, meta] = await prisma.user
      .paginate({
        where: {
          tenantId,
          OR: [
            { name: { contains: searchText, mode: "insensitive" } },
            {
              userInfo: {
                OR: [
                  { email: { contains: searchText, mode: "insensitive" } },
                  {
                    phoneNumber: { contains: searchText, mode: "insensitive" },
                  },
                ],
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          status: true,
          subscriptionType: true,
          userInfo: {
            select: {
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { name: "asc" },
      })
      .withPages(pagination);

    return NextResponse.json({ data, meta }, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error, message: messages.request.failed },
      { status: 500 }
    );
  }
}

//response {"data":[{"id":"24450ff5-f8b0-4acb-8bcd-cafdd57f20f4","name":"Julia Dietrich","status":false,"subscriptionType":"Unlimited","userInfo":{"email":"Roel_Strosin@yahoo.com","phoneNumber":"1-264-919-5981"}}],"meta":{"isFirstPage":true,"isLastPage":true,"currentPage":1,"previousPage":null,"nextPage":null,"pageCount":1,"totalCount":1}}