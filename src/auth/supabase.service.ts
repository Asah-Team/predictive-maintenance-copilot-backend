import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async signUp(email: string, password: string, metadata?: any) {
    const baseUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        // Redirect ke endpoint verification kita setelah konfirmasi email
        emailRedirectTo: `${baseUrl}/auth/verify-email`,
      },
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getUser(accessToken: string) {
    return await this.supabase.auth.getUser(accessToken);
  }

  async refreshToken(refreshToken: string) {
    return await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });
  }

  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email);
  }

  async updateUser(accessToken: string, updates: any) {
    const { data: userData } = await this.supabase.auth.getUser(accessToken);

    if (!userData.user) {
      throw new Error('User not found');
    }

    return await this.supabase.auth.updateUser(updates);
  }

  async verifyOtp(token: string, type: string) {
    // Verify email menggunakan token_hash dari URL
    // Supabase mengirim token_hash di query params
    const verificationType = type === 'signup' ? 'signup' : 'email';

    return await this.supabase.auth.verifyOtp({
      token_hash: token,
      type: verificationType as any,
    });
  }

  async resendVerification(email: string) {
    const baseUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    return await this.supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${baseUrl}/auth/verify-email`,
      },
    });
  }
}
