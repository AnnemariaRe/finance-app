import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/entities/account.entity";
import { Category } from "src/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    amount: number;

    @ApiProperty()
    @Column({ type: 'date' })
    date: Date;
    
    @ApiProperty({ type: () => Account })
    @ManyToOne(() => Account, account => account.transactions)
    account: Account;

    @ApiProperty({ type: () => Category })
    @ManyToOne(() => Category, category => category.transactions)
    category: Category;
}

