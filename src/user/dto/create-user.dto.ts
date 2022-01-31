import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
