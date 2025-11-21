import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { CursesService } from './curses.service';
import { CreateCurseDto } from './dto/create-curse.dto';
import { UpdateCurseDto } from './dto/update-curse.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/roles.enum';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('curses')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard)
export class CursesController {
  constructor(private readonly cursesService: CursesService) {}

  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @Post()
  create(
    @Body(new ValidationPipe()) createCurseDto: CreateCurseDto,
    @Req() { clientUser },
  ) {
    return this.cursesService.create(createCurseDto, clientUser);
  }

  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
  @Post('/:id/enroll')
  enroll(@Param('id') id: string, @Req() { clientUser }) {
    return this.cursesService.enroll(+id, clientUser);
  }

  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
  @Delete('/:id/unenroll')
  unenroll(@Param('id') id: string, @Req() { clientUser }) {
    return this.cursesService.unenroll(+id, clientUser);
  }

  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
  @Get()
  findAll(@Req() { clientUser }) {
    return this.cursesService.findAll(clientUser);
  }

  @Roles(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() { clientUser }) {
    return this.cursesService.findOne(+id, clientUser);
  }

  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ skipNullProperties: true, whitelist: true }))
    updateCurseDto: UpdateCurseDto,
    @Req() { clientUser },
  ) {
    return this.cursesService.update(+id, updateCurseDto, clientUser);
  }

  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() { clientUser }) {
    return this.cursesService.remove(+id, clientUser);
  }
}
