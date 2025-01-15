import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/api/prisma';
import messages from '@/constants/messages';

type HandlerArgs = { params: { id: string } };

// Get a single User
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
    const data = await prisma.user.findUnique({
      where: { 
        id,
        tenantId: tenant_id
      },
      select: {
        id: true,
        name: true,
        expiresAt: true,
        remainingSlots: true,
        status: true,
        subscriptionType: true,
        createdAt: true,
        updatedAt: true,
        userInfo: {
          select: {
            email: true,
            phoneNumber: true,
            address: true,
            birthDate: true,
            birthPlace: true,
            ssn: true,
            nationality: true,
            gender: true,
            emergencyContact: true,
            notes: true
          }
        }
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
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 500 }
    );
  }
}

// Delete a User
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
    await prisma.user.delete({
      where: {
        id,
        tenantId: tenant_id
      }
    });

    return NextResponse.json(
      { message: messages.request.deleted }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 500 }
    );
  }
}

// Update a User
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
      name,
      expiresAt,
      remainingSlots,
      status,
      subscriptionType
    } = body;

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
          tenantId: tenant_id
        },
        data: {
          ...(name && { name }),
          ...(expiresAt && { expiresAt: new Date(expiresAt) }),
          ...(remainingSlots !== undefined && { remainingSlots }),
          ...(status !== undefined && { status }),
          ...(subscriptionType && { subscriptionType })
        },
        include: {
          userInfo: true
        }
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
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