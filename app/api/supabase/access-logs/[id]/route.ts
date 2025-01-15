import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import messages from '@/constants/messages';

type HandlerArgs = { params: { id: string } };
//retrieve access logs for a specific user
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
      .from('access_logs')
      .select(`
        id,
        timestamp,
        door,
        success
      `)
      .eq('userId', id)
      .eq('tenantId', tenant_id)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user access logs:', error);
    return NextResponse.json(
      { error, message: messages.request.failed }, 
      { status: 500 }
    );
  }
}