import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCurseDto } from './dto/create-curse.dto';
import { UpdateCurseDto } from './dto/update-curse.dto';
import { ClientUser } from 'src/users/dto/client-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curse } from './entities/curse.entity';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/users/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class CursesService {
  constructor(
    @InjectRepository(Curse) private cursesRepository: Repository<Curse>,
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createCurseDto: CreateCurseDto, clientUser: ClientUser) {
    const newCurse = this.cursesRepository.create({
      ...createCurseDto,
      user_id: clientUser.id,
    });

    const curseSaved = await this.cursesRepository.save(newCurse);
    return await this.cursesRepository.findOne({
      where: { id: curseSaved.id },
      relations: ['user', 'enrollments'],
    });
  }

  async enroll(id: number, clientUser: ClientUser) {
    const curseFound = await this.cursesRepository.findOneBy({ id });
    if (!curseFound)
      throw new HttpException(
        'The course does not exists',
        HttpStatus.NOT_FOUND,
      );
    const student = await this.usersRepository.findOneBy({ id: clientUser.id });

    if (!student)
      throw new HttpException(
        'Your user does not exists in the database',
        HttpStatus.BAD_REQUEST,
      );

    const enrollmentFound = await this.enrollmentsRepository.findOneBy({
      curse: curseFound,
      student,
    });
    if (enrollmentFound)
      throw new HttpException(
        'You are already enrolled on this curse',
        HttpStatus.BAD_REQUEST,
      );

    const newEnroll = this.enrollmentsRepository.create({
      student: student,
      curse: curseFound,
    });

    return await this.enrollmentsRepository.save(newEnroll);
  }

  async unenroll(id: number, clientUser: ClientUser) {
    const curseFound = await this.cursesRepository.findOneBy({ id });
    if (!curseFound)
      throw new HttpException(
        'The course does not exists',
        HttpStatus.NOT_FOUND,
      );
    const student = await this.usersRepository.findOneBy({ id: clientUser.id });

    if (!student)
      throw new HttpException(
        'Your user does not exists in the database',
        HttpStatus.BAD_REQUEST,
      );

    const enrollmentFound = await this.enrollmentsRepository.findOneBy({
      curse: { id: curseFound.id },
      student: { id: student.id },
    });
    if (!enrollmentFound)
      throw new HttpException(
        'You are not enrolled on this curse',
        HttpStatus.BAD_REQUEST,
      );

    const affected = await this.enrollmentsRepository.delete({
      curse: { id: curseFound.id },
      student: { id: student.id },
    });

    if (!affected.affected) throw new InternalServerErrorException();

    return { message: 'unenrolled successfully' };
  }

  async findAll(clientUser: ClientUser) {
    if (clientUser.role === Role.ADMIN)
      return await this.cursesRepository.find({
        relations: {
          user: true,
          enrollments: {
            student: true,
          },
        },
      });

    const student = await this.usersRepository.findOneBy({ id: clientUser.id });
    if (!student)
      throw new HttpException(
        'Your user does not exists anymore',
        HttpStatus.NOT_FOUND,
      );
    return await this.cursesRepository.find({
      where: {
        enrollments: {
          student,
        },
      },
      relations: {
        user: true,
        enrollments: {
          student: true,
        },
      },
    });
  }

  async findOne(id: number, clientUser: ClientUser) {
    if (clientUser.role === Role.ADMIN)
      return await this.cursesRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
          enrollments: {
            student: true,
          },
        },
      });
    return await this.cursesRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateCurseDto: UpdateCurseDto,
    clientUser: ClientUser,
  ) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const hasValidFields = Object.entries(updateCurseDto).some(
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

    const curseFound = await this.cursesRepository.findOneBy({ id });

    if (!curseFound)
      throw new HttpException(
        'The curse does not exists',
        HttpStatus.NOT_FOUND,
      );

    const updates = { ...updateCurseDto };
    await this.cursesRepository.update({ id }, updates);

    const curseUpdated = await this.cursesRepository.findOneBy({ id });

    return { message: 'Curse updated succesfully', curse: curseUpdated };
  }

  async remove(id: number, clientUser: ClientUser) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const curseFound = await this.cursesRepository.findOneBy({ id });

    if (!curseFound)
      throw new HttpException(
        'The curse does not exists',
        HttpStatus.NOT_FOUND,
      );

    const affected = await this.cursesRepository.delete({ id });

    if (!affected.affected) throw new InternalServerErrorException();

    return { message: 'curse deleted successfully' };
  }
}
