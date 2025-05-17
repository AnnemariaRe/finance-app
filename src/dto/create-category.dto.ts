import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OperationType } from "src/enums/OperationType";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    operationType: OperationType;
}
