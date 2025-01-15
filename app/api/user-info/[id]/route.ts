import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/api/prisma';
import messages from '@/constants/messages';

type HandlerArgs = { params: { id: string } };

// Get a single UserInfo
export async function GET(request: NextRequest, { params }: HandlerArgs) {
  const id = await params.id;
  const tenant_id = request.headers.get('tenant-id');

  if (!tenant_id) {
    return NextResponse.json(
      { message: 'Tenant ID is required' }, 
      { status: 400 }
    );
  }

  try {
    const data = await prisma.userInfo.findUnique({
      where: { 
        userId: id,
        tenantId: tenant_id
      },
      select: {
        userId: true,
        birthDate: true,
        address: true,
        email: true,
        phoneNumber: true,
        birthPlace: true,
        ssn: true,
        nationality: true,
        gender: true,
        emergencyContact: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!data) {
      return NextResponse.json(
        { message: messages.request.notFound }, 
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 500 }
    );
  }
}

// Delete a UserInfo
export async function DELETE(request: NextRequest, { params }: HandlerArgs) {
  const id = await params.id;
  const tenant_id = request.headers.get('tenant-id');

  if (!tenant_id) {
    return NextResponse.json(
      { message: 'Tenant ID is required' }, 
      { status: 400 }
    );
  }

  try {
    await prisma.userInfo.delete({
      where: {
        userId: id,
        tenantId: tenant_id
      }
    });

    return NextResponse.json(
      { message: messages.request.deleted }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user info:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 500 }
    );
  }
}

// Update a UserInfo
export async function PUT(request: NextRequest, { params }: HandlerArgs) {
  const id = await params.id;
  const tenant_id = request.headers.get('tenant-id');

  if (!tenant_id) {
    return NextResponse.json(
      { message: 'Tenant ID is required' }, 
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    const {
      birthDate,
      address,
      email,
      phoneNumber,
      birthPlace,
      ssn,
      nationality,
      gender,
      emergencyContact,
      notes
    } = body;

    try {
      const updatedUserInfo = await prisma.userInfo.update({
        where: {
          userId: id,
          tenantId: tenant_id
        },
        data: {
          ...(birthDate && { birthDate: new Date(birthDate) }),
          ...(address && { address }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
          ...(birthPlace && { birthPlace }),
          ...(ssn && { ssn }),
          ...(nationality && { nationality }),
          ...(gender && { gender }),
          ...(emergencyContact && { emergencyContact }),
          ...(notes && { notes })
        }
      });

      return NextResponse.json(updatedUserInfo, { status: 200 });
    } catch (error) {
      console.error('Error updating user info:', error);
      return NextResponse.json(
        { error, message: messages.request.failed }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 400 }
    );
  }
}