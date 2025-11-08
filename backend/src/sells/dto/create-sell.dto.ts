
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

class SaleItemDto {
  @ApiProperty({ example: '64f8c123abc123def1234567' })
  @IsString()
  medicineId: string;
  @ApiProperty({ example: '64f8c123abc123def1234567', })
  @IsString()
  shopProductId: string;

  @ApiProperty({ example: 'B-0fafaf' })
  @IsString()
  batchId: string;

  @ApiProperty({ example: '2025-06-01' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ example: 120 })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  quantity: number;
}

export class CreateSellDto {
  @ApiProperty({ type: [SaleItemDto] })
  @IsArray()
  items: SaleItemDto[];

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '01712345678' })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
@Transform(({ value }) => Number(value))
  subtotal: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
@Transform(({ value }) => Number(value))
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 1100 })
@Transform(({ value }) => Number(value))
  @IsNumber()
  totalAmount: number;
}
