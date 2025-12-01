// src/sales/dto/sale-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsMongoId, 
  IsDate,
  Min, 
  IsArray,
  ValidateNested,
  IsDateString,
  IsIn,
  IsMobilePhone
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateSaleItemDto {
  @ApiProperty({ 
    description: 'Medicine ID reference',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  medicineId: string;

  @ApiProperty({ 
    description: 'Medicine name',
    example: 'Paracetamol 500mg'
  })
  @IsString()
  medicineName: string;

  @ApiProperty({ 
    description: 'Original price per unit in BDT',
    example: 5.5
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiPropertyOptional({ 
    description: 'Discounted price per unit after item-level discount in BDT',
    example: 4.5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  discountPrice?: number;

  @ApiPropertyOptional({ 
    description: 'Type of item-level discount',
    enum: ['percentage', 'fixed'],
    example: 'percentage'
  })
  @IsOptional()
  @IsEnum(['percentage', 'fixed'])
  itemDiscountType?: 'percentage' | 'fixed';

  @ApiPropertyOptional({ 
    description: 'Item discount value (% or fixed amount)',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  itemDiscountValue?: number;

  @ApiProperty({ 
    description: 'Quantity purchased',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
@Transform(({ value }) => Number(value))
  quantity: number;

  @ApiProperty({ 
    description: 'Line item subtotal (effective price × quantity)',
    example: 9.0
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  subtotal: number;

  @ApiProperty({ 
    description: 'Available stock at time of sale',
    example: 100
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
 @Transform(({ value }) => Number(value))
  stock: number;
  @ApiProperty({ 
    description: 'Available stock at time of sale',
    example: 100
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
 @Transform(({ value }) => Number(value))
  originalPrice: number;

  @ApiPropertyOptional({ 
    description: 'Dosage type (tablet, syrup, etc.)',
    example: 'Tablet'
  })
  @IsOptional()
  @IsString()
  doesType?: string;

  @ApiPropertyOptional({ 
    description: 'Batch ID of the medicine',
    example: 'BATCH-2024-001'
  })
  @IsOptional()
  @IsString()
  batchId?: string;

  @ApiPropertyOptional({ 
    description: 'Expiry date of the medicine',
    example: '2026-12-31T00:00:00.000Z'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => value ? new Date(value) : undefined)
  expiryDate?: Date;
}



export class CreateSellDto {
  @ApiProperty({ 
    description: 'List of items in the sale',
    type: [CreateSaleItemDto]
  })
  @IsArray()

  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];

  @ApiProperty({ 
    description: 'Subtotal before invoice-level discount in BDT',
    example: 500.0
  })
  @IsNumber()
  @Min(0)
 @Transform(({ value }) => Number(value))
  subtotal: number;

  @ApiProperty({ 
    description: 'Invoice-level discount type',
    enum: ['percentage', 'fixed'],
    example: 'percentage'
  })
  @IsEnum(['percentage', 'fixed'])
  discountType: 'percentage' | 'fixed';

  @ApiProperty({ 
    description: 'Invoice-level discount value',
    example: 5
  })
  @IsNumber()
  @Min(0)
   @Transform(({ value }) => Number(value))
  discountValue: number;

  @ApiProperty({ 
    description: 'Calculated invoice-level discount amount in BDT',
    example: 25.0
  })
  @IsNumber()
  @Min(0)
 @Transform(({ value }) => Number(value))
  discountAmount: number;

  @ApiProperty({ 
    description: 'Total item-level discounts in BDT',
    example: 10.0
  })
  @IsNumber()
  @Min(0)
 @Transform(({ value }) => Number(value))
  itemsDiscount: number;

  @ApiProperty({ 
    description: 'Total combined discount (item + invoice) in BDT',
    example: 35.0
  })
  @IsNumber()
  @Min(0)
 @Transform(({ value }) => Number(value))
  totalDiscount: number;

  @ApiProperty({ 
    description: 'Final total amount in BDT',
    example: 465.0
  })
  @IsNumber()
  @Min(0)
 @Transform(({ value }) => Number(value))
  total: number;

  @ApiProperty({ 
    description: 'Payment status',
    enum: ['paid', 'due'],
    example: 'paid'
  })
  @IsEnum(['paid', 'due'])
  paymentStatus: 'paid' | 'due';

  @ApiProperty({ 
    description: 'Amount paid by customer in BDT',
    example: 465.0
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  paidAmount: number;

  @ApiPropertyOptional({ 
    description: 'Customer name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ 
    description: 'Customer phone number',
    example: '+8801712345678'
  })
  @IsOptional()
  @IsString()
  @IsMobilePhone('bn-BD')
  customerPhone?: string;

  @ApiPropertyOptional({ 
    description: 'Name of staff who issued the sale',
    example: 'Admin User'
  })
  @IsOptional()
  @IsString()
  issuedBy?: string;

  @ApiPropertyOptional({ 
    description: 'Payment transaction ID',
    example: 'TXN-20251201-001'
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ 
    description: 'Payment method used',
    example: 'Cash'
  })
  @IsString()
  paymentType: string;

  @ApiPropertyOptional({ 
    description: 'Custom invoice ID',
    example: 'INV-2024-0001'
  })
  @IsOptional()
  @IsString()
  invoiceId?: string;
}



export class SalesQueryDto {
  @ApiPropertyOptional({
    description: 'Search by invoice, customer name, phone, etc.',
    type: String,
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Filter sales by status',
    isArray: true,
    enum: ['paid', 'due'],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? [value] : value)
  @IsEnum(['paid', 'due'], { each: true })
  status?: ('paid' | 'due')[];

  @ApiPropertyOptional({
    description: 'Sort sales by date, price or invoice',
    enum: [
      'date-asc',
      'date-desc',
      'price-asc',
      'price-desc',
      'invoice-asc',
      'invoice-desc',
    ],
  })
  @IsOptional()
  @IsEnum([
    'date-asc',
    'date-desc',
    'price-asc',
    'price-desc',
    'invoice-asc',
    'invoice-desc',
  ])
  sortBy?:
    | 'date-asc'
    | 'date-desc'
    | 'price-asc'
    | 'price-desc'
    | 'invoice-asc'
    | 'invoice-desc';

  @ApiPropertyOptional({
    description: 'Current page for pagination',
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  currentPage?: number;

  @ApiPropertyOptional({
    description: 'Items per page for pagination',
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  itemsPerPage?: number;
}



export class CustomerSalesQueryDto {
  @ApiPropertyOptional({
    description: 'Search by customer name, phone, invoice ID, etc.',
    type: String,
  })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @ApiPropertyOptional({
    description: 'Filter customers by payment status',
    isArray: true,
    enum: ['paid', 'due'],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => typeof value === 'string' ? [value] : value)
  @IsEnum(['paid', 'due'], { each: true })
  status?: ('paid' | 'due')[];

  @ApiPropertyOptional({
    description: 'Sort customers by name, due amount, or purchase date',
    enum: [
      'name-asc',
      'name-desc',
      'due-asc',
      'due-desc',
      'date-asc',
      'date-desc',
    ],
  })
  @IsOptional()
  @IsEnum([
    'name-asc',
    'name-desc',
    'due-asc',
    'due-desc',
    'date-asc',
    'date-desc',
  ])
  sortBy?:
    | 'name-asc'
    | 'name-desc'
    | 'due-asc'
    | 'due-desc'
    | 'date-asc'
    | 'date-desc';

  @ApiPropertyOptional({
    description: 'Current page for pagination',
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  currentPage?: number;

  @ApiPropertyOptional({
    description: 'Items per page for pagination',
    type: Number,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  itemsPerPage?: number;
}


export class DashboardDateRangeDto {
  @ApiPropertyOptional({
    description: 'Predefined time range filter',
    enum: ['today', 'week', 'month', 'year'],
  })
  @IsOptional()
  @IsIn(['today', 'week', 'month', 'year'])
  range?: 'today' | 'week' | 'month' | 'year';

  @ApiPropertyOptional({
    description: 'Start date for custom date range filter',
    example: '2025-11-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'End date for custom date range filter',
    example: '2025-11-30',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}


