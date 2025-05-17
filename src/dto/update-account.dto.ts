import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  title: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
  @ApiProperty({ required: false })
  @IsOptional()
  accountType: string;
}
