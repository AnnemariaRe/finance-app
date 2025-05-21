import { ApiProperty } from '@nestjs/swagger';
import { Currency } from './currency.entity';
import { AccountType } from '../enums/AccountType';
import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
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
  title: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ type: () => Currency })
  @ManyToOne(() => Currency)
  currency: Currency;
}
