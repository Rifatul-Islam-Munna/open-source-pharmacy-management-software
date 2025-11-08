

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  Min,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ example: '6730bf1d98b219d49ee7210f' })
  @IsMongoId()
  @IsNotEmpty()
  shopMedicineId: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
@Transform(({ value }) => Number(value))
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '2026-04-15' })
  @IsDateString()
  expiryDate: string;

  @ApiProperty({ example: 120.5 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  price: number;
}
