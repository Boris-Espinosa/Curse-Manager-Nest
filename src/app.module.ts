import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CursesModule } from './curses/curses.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Curse } from './curses/entities/curse.entity';
import 'dotenv/config';
import { Enrollment } from './users/entities/enrollment.entity';

@Module({
  imports: [
    UsersModule,
    CursesModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 6000 },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'curses',
      port: 3306,
      host: 'localhost',
      username: 'root',
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Curse, Enrollment],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
