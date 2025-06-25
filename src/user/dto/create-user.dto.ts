import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsNumber()
  age: number;

  @IsString()
  phone: string;

  @IsString()
  idCard: string;

  @IsString()
  gender: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  supabaseUserId?: string;
}
