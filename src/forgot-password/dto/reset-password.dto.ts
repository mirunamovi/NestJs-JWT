import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs';


export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

}