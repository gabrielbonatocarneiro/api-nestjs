import { MomentJS } from 'src/helpers/MomentJS';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  user_id: bigint;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'datetime',
    default: null,
  })
  created_at: string;

  @Column({
    type: 'datetime',
    default: null,
  })
  updated_at: string;

  @BeforeInsert()
  createUser(): void {
    const moment = new MomentJS();

    if (!this.created_at) {
      this.created_at = moment.now();
    }

    if (!this.updated_at) {
      this.updated_at = moment.now();
    }
  }

  @BeforeUpdate()
  updateUser(): void {
    const moment = new MomentJS();

    this.updated_at = moment.now();
  }
}