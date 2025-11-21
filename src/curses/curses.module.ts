import { Module } from '@nestjs/common';
import { CursesService } from './curses.service';
import { CursesController } from './curses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curse } from './entities/curse.entity';
import { Enrollment } from 'src/users/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curse, Enrollment, User])],
  controllers: [CursesController],
  providers: [CursesService],
})
export class CursesModule {}
