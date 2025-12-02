import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePurchaseOrderDto {


  @ApiProperty({
    description: 'Name and dosage of the medicine',
    example: 'Amoxicillin 500mg',
  })
  @IsString()
  @IsNotEmpty()
  medicine: string;

  @ApiProperty({
    description: 'Quantity in boxes',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  box: number;

  @ApiProperty({
    description: 'Quantity in boxes',
    example: 30,
    minimum: 1,
  })
  @IsInt()
@IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: ['pending', 'ordered', 'received',"cancelled"],
  })
  @IsEnum(['pending', 'ordered', 'received','cancelled'])
  @IsOptional()
  status: 'pending' | 'ordered' | 'received'|'cancelled';


}


export class PurchaseOrdersFilterDto {
  @ApiPropertyOptional({
    description: 'Medicine name search keyword',
    example: 'amoxicillin',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['all', 'pending', 'ordered', 'received'],
    example: 'pending',
  })
  @IsOptional()
  @IsEnum(['all', 'pending', 'ordered', 'received','cancelled'])
  status?: 'all' | 'pending' | 'ordered' | 'received' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['date-desc', 'date-asc', 'qty-desc', 'qty-asc'],
    example: 'date-desc',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'date-desc' | 'date-asc' | 'qty-desc' | 'qty-asc';

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
   @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Rows per page',
    example: 6,
    minimum: 1,
    default: 6,
  })
  @IsOptional()
  @IsInt()
   @Transform(({ value }) => parseInt(value))
  @Min(1)
  rowsPerPage?: number = 6;
}

export class updateMultiple{
    @ApiPropertyOptional({
    description: 'Medicine name search keyword',
    example: 'delete,approve',
  })

  @IsString()
  type?: string;


  @ApiProperty()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? [value] : value)
  ids: string[]
}
