import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ClientUser } from './dto/client-user.dto';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userFound = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userFound)
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    const newUser = this.usersRepository.create(createUserDto);
    const passwordHash = await bcrypt.hash(newUser.password, 10);
    newUser.password = passwordHash;
    await this.usersRepository.save(newUser);
    return await this.usersRepository.findOneBy({ email: newUser.email });
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: {
        curses: true,
        enrollments: {
          curse: true,
        },
      },
    });
  }

  async findOne(email: string) {
    const userFound = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: {
        curses: true,
        enrollments: {
          curse: true,
        },
      },
    });
    if (!userFound) return null;
    return userFound;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    clientUser: ClientUser,
  ) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const userFound = await this.usersRepository.findOneBy({ id });

    if (!userFound)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    const hasValidFields = Object.entries(updateUserDto).some(
      ([key, value]) =>
        key !== null &&
        value !== null &&
        key !== undefined &&
        value !== undefined &&
        key !== '' &&
        value !== '',
    );

    if (!hasValidFields)
      throw new HttpException(
        'Please enter at least 1 valid field',
        HttpStatus.BAD_REQUEST,
      );

    const updates = { ...updateUserDto };
    try {
      await this.usersRepository.update({ id }, updates);
      const userUpdated = await this.usersRepository.findOneBy({ id });
      return { message: 'User updated succesfully', user: userUpdated };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new HttpException(
          'The email is already in use',
          HttpStatus.BAD_REQUEST,
        );

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, clientUser: ClientUser) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const userFound = await this.usersRepository.findOneBy({ id });

    if (!userFound)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    const affected = await this.usersRepository.delete({ id });
    if (!affected.affected) {
      throw new HttpException(
        'There was an error deleting the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'User deleted succesfully' };
  }
}
