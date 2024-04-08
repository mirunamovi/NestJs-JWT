import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  readonly password: string;
}
