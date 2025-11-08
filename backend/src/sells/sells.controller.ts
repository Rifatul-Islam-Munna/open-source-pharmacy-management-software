import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellsService } from './sells.service';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';

@Controller('sells')
export class SellsController {
  constructor(private readonly sellsService: SellsService) {}

  @Post('create-new-sales')
  create(@Body() createSellDto: CreateSellDto) {
    return this.sellsService.create(createSellDto);
  }

  @Get()
  findAll() {
    return this.sellsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellDto: UpdateSellDto) {
    return this.sellsService.update(+id, updateSellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellsService.remove(+id);
  }
}
