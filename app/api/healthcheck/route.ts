import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

// import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function GET() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (error || !user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const userSupabase = await createClient();
//   const { data, error: queryError } = await userSupabase
//     .from("tenants")
//     .select("*");
//   if (queryError) {
//     return NextResponse.json({ error: queryError.message }, { status: 500 });
//   }

//   return NextResponse.json({ data }, { status: 200 });

//   return NextResponse.json({ status: "ok" }, { status: 200 });
// }
