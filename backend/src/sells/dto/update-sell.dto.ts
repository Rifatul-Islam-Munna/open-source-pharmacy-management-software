import { PartialType } from '@nestjs/swagger';
import { CreateSellDto } from './create-sell.dto';

export class UpdateSellDto extends PartialType(CreateSellDto) {}
