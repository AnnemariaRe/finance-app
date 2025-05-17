import { ApiProperty } from '@nestjs/swagger';
import { OperationType } from 'src/enums/OperationType';
import { Transaction } from '../entities/transaction.entity';
import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: OperationType,
  })
  operationType: OperationType;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.accounts, { nullable: true })
  user: User;

  @ApiProperty({ type: () => Transaction })
  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    cascade: true,
  })
  transactions: Transaction[];
}
