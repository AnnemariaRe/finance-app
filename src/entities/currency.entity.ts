import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}
