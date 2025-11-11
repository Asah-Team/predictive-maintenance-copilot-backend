import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private supabaseService: SupabaseService,
  ) {
    const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');

    if (!jwtSecret) {
      throw new Error(
        'SUPABASE_JWT_SECRET is not defined. Please check your .env file.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true, // Enable request dalam validate
    });
  }

  async validate(req: Request, payload: any) {
    console.log('🔐 JWT Strategy - Validating token');
    console.log('📋 Payload received:', {
      sub: payload.sub,
      email: payload.email,
    });

    try {
      // Extract access token dari header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.log('❌ No authorization header');
        throw new UnauthorizedException('No authorization header');
      }

      const accessToken = authHeader.replace('Bearer ', '');

      // Verifikasi token masih valid di Supabase (check session)
      console.log('🔍 Checking session validity with Supabase...');
      const { data: supabaseUser, error: supabaseError } =
        await this.supabaseService.getUser(accessToken);

      if (supabaseError || !supabaseUser.user) {
        console.log('❌ Session invalid or expired in Supabase');
        throw new UnauthorizedException('Session has been invalidated');
      }

      console.log('✅ Session is valid in Supabase');

      // Payload dari Supabase JWT berisi: sub (user id), email, role, dll
      const user = await this.userService.findBySupabaseId(payload.sub);

      console.log('👤 User found in DB:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('➕ Creating user from Supabase data');
        // Jika user belum ada di database lokal, create dari Supabase data
        const newUser = await this.userService.createFromSupabase({
          id: payload.sub,
          email: payload.email,
          fullName: payload.user_metadata?.full_name,
        });
        console.log('✅ User created successfully');
        return newUser;
      }

      if (!user.isActive) {
        console.log('❌ User account is inactive');
        throw new UnauthorizedException('User account is inactive');
      }

      console.log('✅ User validated successfully');
      return user;
    } catch (error) {
      console.error('❌ JWT validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
