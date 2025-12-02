import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto, getAllMedicineDto, multipleData, PaginationDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicine')
export class MedicineController {
  private logger = new Logger(MedicineController.name);
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }
  @Post('post-multiple')
  postMultiple(@Body() createMedicineDto: CreateMedicineDto[]) {
    
    
    return this.medicineService.uploadBulkFile(createMedicineDto);
  }

  @Get()
  findAll(@Query() query:getAllMedicineDto) {
    return this.medicineService.findAll(query);
  }
  @Get('get-all-with-pagination')
  findAllWithPagination(@Query() query:PaginationDto) {
    return this.medicineService.findWithPagination(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
    return this.medicineService.update(+id, updateMedicineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineService.remove(+id);
  }
}
