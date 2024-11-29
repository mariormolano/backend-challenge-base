import { Injectable } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  public constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string, // Usa una clave más restrictiva si es necesario
    );
  }

  public async getUser(token: string): Promise<Object> {
    return this.supabase.auth.getUser(token);
  }
}
