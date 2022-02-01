import { MomentJS } from 'src/helpers/MomentJS';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  document_id: bigint;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  user_id: bigint;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'tinyint',
    default: false,
    nullable: false,
  })
  international: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  number: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  complement: string;

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
  createDocument(): void {
    const moment = new MomentJS();

    if (!this.created_at) {
      this.created_at = moment.now();
    }

    if (!this.updated_at) {
      this.updated_at = moment.now();
    }
  }

  @BeforeUpdate()
  updateDocument(): void {
    this.updated_at = new MomentJS().now();
  }
}
