import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Currency {
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
  @Column({ length: 3, nullable: true })
  code: string;

  @ApiProperty()
  @Column({ type: 'char' })
  symbol: string;

  @ApiProperty({ type: () => Account })
  @OneToMany(() => Account, (account) => account.currency, { cascade: true })
  accounts: Account[];
}
