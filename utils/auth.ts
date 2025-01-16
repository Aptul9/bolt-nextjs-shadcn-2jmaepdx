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
    let clientSupabase = await createClient()
    let authenticatedUser: SupabaseUser | null = null
    
    // Handle token-based auth (external clients)
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1]
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      
      if (error || !user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }

      // Create a new Supabase client with the token
      clientSupabase = await createClient()
      await clientSupabase.auth.setSession({
        access_token: token,
        refresh_token: ''
      })
      
      authenticatedUser = user
    } else {
      // Cookie-based auth (Next.js client)
      const { data: { user }, error } = await clientSupabase.auth.getUser()
      
      if (error || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      
      authenticatedUser = user
    }

    // Fetch tenant information using supabaseAdmin
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('ownerId', authenticatedUser.id)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "No active tenant found for this user" }, { status: 403 })
    }

    return {
      supabase: clientSupabase,
      user: authenticatedUser,
      tenantId: tenant.id
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}