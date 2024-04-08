import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6) // Example: Minimum password length
  password: string;

  @IsNotEmpty()
  refreshToken: string;
}