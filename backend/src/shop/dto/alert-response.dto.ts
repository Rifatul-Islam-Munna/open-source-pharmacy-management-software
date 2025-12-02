// src/shop-stock-batch/dto/alert-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// src/shop-stock-batch/dto/alert-response.dto.ts
export class AlertItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  batchName: string;

  @ApiProperty({ enum: ['expiring', 'low-stock'] })
  type: 'expiring' | 'low-stock';

  @ApiPropertyOptional({ nullable: true })
  expiryDate?: Date | null;  // ✅ Accepts Date, null, or undefined

  @ApiPropertyOptional({ nullable: true })
  currentStock?: number | null;

  @ApiPropertyOptional({ nullable: true })
  threshold?: number | null;

  @ApiPropertyOptional({ nullable: true })
  daysUntilExpiry?: number | null;

  @ApiProperty()
  shopMedicineId: string;
}


export class GetAlertsResponseDto {
  @ApiProperty({ type: [AlertItemDto] })
  data: AlertItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;
}
