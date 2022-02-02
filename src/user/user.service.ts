import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

import { User } from './entities/user.entity';

import { Helper } from './../helper';

import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findOne(userId: number): Promise<UserDto> {
    let user = await this.redis.get(`user_id_${userId}`);

    if (user) {
      user = JSON.parse(user);
      return user;
    }

    return await this.userRepository.findOne(userId, {
      select: ['user_id', 'name', 'email', 'created_at', 'updated_at'],
      relations: ['documents'],
    });
  }

  async findByEmail(userEmail: string): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: {
        email: userEmail,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const hashPassword = await new Helper().generateHash(
      createUserDto.password,
    );

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashPassword,
    });

    let user = await this.userRepository.save(newUser);

    delete user.password;

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const { name, email, password, new_password } = updateUserDto;

    const user = await this.userRepository.findOneOrFail(userId);

    if (
      password &&
      new_password &&
      !(await new Helper().valueIsEqualHash(password, user.password))
    ) {
      throw new Error('Invalid password');
    }

    let hashedPassword = user.password;

    if (new_password) {
      hashedPassword = await new Helper().generateHash(new_password);
    }

    const userUpdated = await this.userRepository.save({
      ...user,
      name: name || updateUserDto.name,
      email: email || updateUserDto.email,
      password: hashedPassword,
      updated_at: new Helper().now(),
    });

    delete userUpdated.password;

    return userUpdated;
  }

  async remove(userId: number) {
    const user = await this.userRepository.findOneOrFail(userId);

    return this.userRepository.remove(user);
  }
}
