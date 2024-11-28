import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string, // Usa una clave más restrictiva si es necesario
    );
  }

  async getUser(token: string) {
    return this.supabase.auth.getUser(token);
  }
}

