
import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AlertType {
  ALL = 'all',
  LOW_STOCK = 'low-stock',
  EXPIRING = 'expiring',
}

export enum SortBy {
  URGENCY = 'urgency',
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc',
  STOCK_ASC = 'stock-asc',
  STOCK_DESC = 'stock-desc',
}

export class GetAlertsQueryDto {
  @ApiPropertyOptional({ enum: AlertType, default: AlertType.ALL })
  @IsOptional()
  @IsEnum(AlertType)
  filterType?: AlertType = AlertType.ALL;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.URGENCY })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.URGENCY;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
@Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 8 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  itemsPerPage?: number = 8;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({ default: 30, description: 'Days threshold for expiring alerts' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  expiryDaysThreshold?: number = 90;

  @ApiPropertyOptional({ default: 15, description: 'Stock threshold for low stock alerts' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  lowStockThreshold?: number = 15;
}
