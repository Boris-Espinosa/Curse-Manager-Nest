import { PartialType } from '@nestjs/mapped-types';
import { CreateCurseDto } from './create-curse.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCurseDto extends PartialType(CreateCurseDto) {
  @IsString()
  @IsNotEmpty()
  title?: string | undefined;

  @IsString()
  @IsNotEmpty()
  description?: string | undefined;
}
