// utils/auth.ts
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from "@/utils/supabase"
import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js'

export type AuthenticatedClient = {
  supabase: SupabaseClient
  user: SupabaseUser
  tenantId: string
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticatedClient | NextResponse> {
  try {
    // Handle token-based auth (external clients)
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]
      
      // Verify the token first
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
      
      if (userError || !user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Create a new Supabase client with the token
      const clientSupabase = await createClient()
      const { error: sessionError } = await clientSupabase.auth.setSession({
        access_token: token,
        refresh_token: token  // Or handle refresh token properly
      })

      if (sessionError) {
        return NextResponse.json({ error: "Session setup failed" }, { status: 401 })
      }

      // Fetch tenant using the client instance, not admin
      const { data: tenant, error: tenantError } = await clientSupabase
        .from('tenants')
        .select('id')
        .eq('ownerId', user.id)
        .single()

      if (tenantError || !tenant) {
        return NextResponse.json({ error: "No active tenant found for this user" }, { status: 403 })
      }

      return {
        supabase: clientSupabase,
        user,
        tenantId: tenant.id
      }
    } else {
      // Cookie-based auth (Next.js client)
      const clientSupabase = await createClient()
      const { data: { user }, error: userError } = await clientSupabase.auth.getUser()
      
      if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Fetch tenant using the client instance
      const { data: tenant, error: tenantError } = await clientSupabase
        .from('tenants')
        .select('id')
        .eq('ownerId', user.id)
        .single()

      if (tenantError || !tenant) {
        return NextResponse.json({ error: "No active tenant found for this user" }, { status: 403 })
      }

      return {
        supabase: clientSupabase,
        user,
        tenantId: tenant.id
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function authenticateDevice(accessKey: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("devices")
    .select("tenantId")
    .eq("accessKey", accessKey)
    .single();

  if (error || !data) {
    console.error("Device authentication failed:", error);
    return null;
  }

  return data.tenantId;
}