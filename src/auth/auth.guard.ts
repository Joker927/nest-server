import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { supabase } from '../supabase.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  private extractBearerToken(authHeader?: string | string[]): string | null {
    if (!authHeader) {
      return null;
    }

    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const [scheme, token] = header.trim().split(/\s+/);

    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    return token;
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    const token = this.extractBearerToken(authHeader);

    if (!token) {
      throw new UnauthorizedException('缺少有效的 Bearer token');
    }

    // 用 Supabase 校验 token
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('token 无效或已过期');
    }
    request.user = data.user; // 挂载 supabase 用户信息
    return true;
  }

} 
