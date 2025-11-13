import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateShopDto } from './create-shop.dto';
import { IsMongoId } from 'class-validator';

export class UpdateShopDto extends PartialType(CreateShopDto) {
    @ApiPropertyOptional()
    @IsMongoId()

    id:string;
}
