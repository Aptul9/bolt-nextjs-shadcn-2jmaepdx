// import { NextResponse } from 'next/server';

// import { user_role } from '@prisma/client';
// import { User } from '@supabase/supabase-js';

// import { getSupabaseUser } from 'lib/supabase/actions/auth';
// import { createSupabaseServerClient } from 'lib/supabase/server';
// import messages from "@/constants/messages";


// export const get_claims = async (uid: string) => {
// 	const client = await createSupabaseServerClient();
// 	return await client.rpc('get_claims', { uid });
// };
// export const get_claim = async (uid: string, claim: string) => {
// 	const client = await createSupabaseServerClient();
// 	return await client.rpc('get_claim', { uid, claim });
// };

// export const set_claim = async (uid: string, claim: string, value: any) => {
// 	const client = await createSupabaseServerClient();
// 	return await client.rpc('set_claim', { uid, claim, value });
// };
// export const delete_claim = async (uid: string, claim: string) => {
// 	const client = await createSupabaseServerClient();
// 	return await client.rpc('delete_claim', { uid, claim });
// };

// type AuthCallbackArgs = { user: User; tenant_id: string; role: user_role };
// type AuthCallback = ({ user, tenant_id, role }: AuthCallbackArgs) => NextResponse | Promise<NextResponse>;

// export const checkAuth = async (callback: AuthCallback) => {
// 	const user = await getSupabaseUser();
// 	if (!user) {
// 		return NextResponse.json({ message: messages.account.unauthorized }, { status: 401 });
// 	}

// 	const role = user.app_metadata.user_role;
// 	const tenant_id = user.app_metadata.tenant_id;
// 	if (!role || !tenant_id) {
// 		return NextResponse.json({ message: messages.request.failed }, { status: 403 });
// 	}

// 	return callback({ user, tenant_id, role });
// };