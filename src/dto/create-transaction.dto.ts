import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateTransactionDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @ApiProperty()
    @IsNotEmpty()
    account: string;

    @ApiProperty()
    @IsNotEmpty()
    category: string;
}
