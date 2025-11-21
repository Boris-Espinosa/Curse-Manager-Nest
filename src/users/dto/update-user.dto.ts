import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  username?: string | undefined;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string | undefined;

  @IsString()
  @IsNotEmpty()
  password?: string | undefined;
}
