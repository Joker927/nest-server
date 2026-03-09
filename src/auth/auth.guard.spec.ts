import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { supabase } from '../supabase.config';

jest.mock('../supabase.config', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('AuthGuard', () => {
  const getRequest = jest.fn();
  const mockExecutionContext = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest,
    })),
  } as unknown as ExecutionContext;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;

  const getUserMock = supabase.auth.getUser as jest.Mock;
  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(mockReflector);
    mockReflector.getAllAndOverride = jest.fn().mockReturnValue(false);
  });

  it('should skip auth when route is public', async () => {
    mockReflector.getAllAndOverride = jest.fn().mockReturnValue(true);

    const canActivate = await guard.canActivate(mockExecutionContext);

    expect(canActivate).toBe(true);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it('should throw when authorization header is missing', async () => {
    getRequest.mockReturnValue({ headers: {} });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw when authorization header is not Bearer token', async () => {
    getRequest.mockReturnValue({
      headers: { authorization: 'Basic dXNlcjpwYXNz' },
    });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should read token from string[] authorization header and attach user', async () => {
    const request: any = {
      headers: { authorization: ['Bearer valid-token'] },
    };
    getRequest.mockReturnValue(request);
    getUserMock.mockResolvedValue({
      data: { user: { id: 'supabase-user-id' } },
      error: null,
    });

    const canActivate = await guard.canActivate(mockExecutionContext);

    expect(canActivate).toBe(true);
    expect(getUserMock).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual({ id: 'supabase-user-id' });
  });
});
