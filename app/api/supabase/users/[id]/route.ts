import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import messages from '@/constants/messages';

type HandlerArgs = { params: { id: string } };

export async function GET(request: NextRequest, { params }: HandlerArgs) {
  const { id } = params;
  const tenant_id = request.headers.get('tenant-id');

  if (!tenant_id) {
    return NextResponse.json(
      { message: 'Tenant ID is required' }, 
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        subscriptionType,
        status,
        expiresAt,
        remainingSlots,
        userInfo:users_info (
          email,
          phoneNumber,
          address,
          birthDate,
          birthPlace,
          nationality,
          gender,
          emergencyContact,
          notes
        )
      `)
      .eq('id', id)
      .eq('tenantId', tenant_id)
      .single();

    if (error) throw error;

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