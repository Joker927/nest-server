import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  supabaseUserId?: string;
}
