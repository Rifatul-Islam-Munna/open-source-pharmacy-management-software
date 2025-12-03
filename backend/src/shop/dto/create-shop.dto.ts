

import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  Min,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsInt,
  Max,
} from 'class-validator';


export class ShopBatchQuantityDto {
  @ApiProperty({ example: 10, description: 'Number of boxes' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsOptional()
  boxes: number;

  @ApiProperty({ example: 10, description: 'Cartons per box' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
   @IsOptional()
  @Min(0)
  cartonPerBox: number;

  @ApiProperty({ example: 10, description: 'Strips per carton' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
   @IsOptional()
  @Min(0)
  stripsPerCarton: number;

  @ApiProperty({ example: 10, description: 'Units per strip' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
   @IsOptional()
  @Min(0)
  unitsPerStrip: number;
}
export class CreateShopDto {
  @ApiProperty({ example: '6730bf1d98b219d49ee7210f' })
  @IsMongoId()
  @IsOptional()

  shopMedicineId: string;

  @ApiProperty({ 
    description: 'Quantity breakdown in boxes, cartons, strips, and units',
    example: {
      boxes: 5,
      cartonPerBox: 10,
      stripsPerCarton: 10,
      unitsPerStrip: 10
    }
  })
  @ValidateNested()
  @Type(() => ShopBatchQuantityDto)
  @IsOptional()
  quantity: ShopBatchQuantityDto;

  @ApiProperty({ example: '2026-04-15', description: 'Batch expiry date' })
  @IsDateString()
  @IsNotEmpty()
  expiryDate: string;

  @ApiProperty({ example: 120.5, description: 'Selling price per unit' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  sellingPrice: number;

  @ApiProperty({ example: 100.0, description: 'Purchase price per unit' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ 
    example: 'Napa 500mg', 
    description: 'Medicine name for this batch',
    required: false 
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    example: 'B-1234567', 
    description: 'Batch number (auto-generated if not provided)',
    required: false 
  })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ 
    example: 5000, 
    description: 'Total units (can be calculated from quantity)',
    required: false 
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsOptional()
  totalUnits?: number;
}




export enum StockStatus {
  IN_STOCK = 'in-stock',
  LOW_STOCK = 'low-stock',
  OUT_OF_STOCK = 'out-of-stock',
}

export enum SortBy {
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  EXPIRY_ASC = 'expiry-asc',
  EXPIRY_DESC = 'expiry-desc',
  Quantity_ASC = 'quantity-asc',
  Quantity_DESC = 'quantity-desc',
}

export class SearchShopProductDto {
  @ApiProperty({
    description: 'Search query for product name or SKU',
    required: false,
    example: 'Paracetamol',
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiProperty({
    description: 'Current page number',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by stock status (can select multiple)',
    required: false,
    enum: StockStatus,
    isArray: true,
    example: ['in-stock', 'low-stock'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StockStatus, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',');
    return [];
  })
  stockStatus?: StockStatus[];

  @ApiProperty({
    description: 'Sort products by specified criteria',
    required: false,
    enum: SortBy,
    example: 'name-asc',
    default: 'name-asc',
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.NAME_ASC;
}





