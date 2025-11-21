import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register(user: CreateUserDto) {
    const newUser = await this.usersService.create(user);
    if (!newUser)
      throw new HttpException(
        'There was an error trying to create the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'User registered succesfully', user: newUser, token };
  }

  async login(user: LoginDto) {
    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: user.email })
      .getOne();
    if (!userFound)
      return new HttpException('User does not exists', HttpStatus.NOT_FOUND);

    const isMatch = await bcrypt.compare(user.password, userFound.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      sub: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };
    const { password, ...userLogged } = userFound;
    const token = await this.jwtService.signAsync(payload);
    return { message: 'User logged in succesfully', user: userLogged, token };
  }
}
