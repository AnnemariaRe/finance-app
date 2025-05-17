import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ type: () => Account })
  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts: Account[];

  @ApiProperty({ type: () => Category })
  @OneToMany(() => Category, (category) => category.user, { cascade: true })
  categories: Category[];
}
