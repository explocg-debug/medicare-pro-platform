import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type UserRole = Database["public"]["Enums"]["user_role"];

export type ApiRoleCheck =
  | {
      ok: true;
      userId: string;
      role: UserRole;
    }
  | {
      ok: false;
      status: 401 | 403 | 500;
      error: string;
    };

export async function requireApiRole(
  allowedRoles: UserRole[],
): Promise<ApiRoleCheck> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      status: 401,
      error: "Authentication required.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      ok: false,
      status: 500,
      error: "Unable to verify the account role.",
    };
  }

  if (!allowedRoles.includes(profile.role)) {
    return {
      ok: false,
      status: 403,
      error: "You do not have permission to use this AI feature.",
    };
  }

  return {
    ok: true,
    userId: user.id,
    role: profile.role,
  };
}
