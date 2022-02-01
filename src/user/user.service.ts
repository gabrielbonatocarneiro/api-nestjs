import { MomentJS } from 'src/helpers/MomentJS';
import { Bcrypt } from './../helpers/Bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(userId: number): Promise<UserDto> {
    return await this.userRepository.findOne(userId, {
      select: ['user_id', 'name', 'email', 'created_at', 'updated_at'],
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
    const hashPassword = await new Bcrypt().generateHash(
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
      !(await new Bcrypt().valueIsEqualHash(password, user.password))
    ) {
      throw new Error('Invalid password');
    }

    let hashedPassword = user.password;

    if (new_password) {
      hashedPassword = await new Bcrypt().generateHash(new_password);
    }

    const userUpdated = await this.userRepository.save({
      ...user,
      name: name || updateUserDto.name,
      email: email || updateUserDto.email,
      password: hashedPassword,
      updated_at: new MomentJS().now(),
    });

    delete userUpdated.password;

    return userUpdated;
  }

  async remove(userId: number) {
    const user = await this.userRepository.findOneOrFail(userId);

    return this.userRepository.remove(user);
  }
}
