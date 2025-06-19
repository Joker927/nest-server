import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsNumber()
  age: number;

  @IsString()
  phone: string;

  @IsString()
  idCard: string;

  @IsString()
  gender: string;
}
