import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { DosageType } from '../entities/medicine.schema';
import { Transform } from 'class-transformer';

export class CreateMedicineDto {
  @ApiPropertyOptional({ example: 'Napa' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: DosageType, example: DosageType.Tablet })
  @IsOptional()
  @IsEnum(DosageType)
  dosageType?: DosageType;

  @ApiPropertyOptional({ example: 'Paracetamol' })
  @IsOptional()
  @IsString()
  generic?: string;

  @ApiPropertyOptional({ example: '500mg' })
  @IsOptional()
  @IsString()
  strength?: string;

  @ApiPropertyOptional({ example: 'Square Pharmaceuticals' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsString()
  UnitPrice?: string;

  @ApiPropertyOptional({ example: '1 Box (10 tablets)' })
  @IsOptional()
  @IsString()
  PackageSize?: string;

  // ✅ slug should NOT be optional
  @ApiPropertyOptional({ example: 'napa-500mg-tablet' })
    @IsOptional()
  @IsString()
  slug: string;
}

export class getAllMedicineDto{
  @ApiPropertyOptional({ example: 'Napa' })
  @IsOptional()
  @IsString()
  name?: string;
}
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by medicine name',
    example: 'Napa',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

