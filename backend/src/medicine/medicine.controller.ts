import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger, UseGuards, Req } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto, getAllMedicineDto, multipleData, PaginationDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { AuthGuard,type ExpressRequest } from 'src/auth/auth.guard';

@Controller('medicine')
@UseGuards(AuthGuard)
export class MedicineController {
  private logger = new Logger(MedicineController.name);
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto,@Req() req:ExpressRequest) {
    return this.medicineService.create(createMedicineDto,req.user.slug);
  }
  @Post('post-multiple')
  postMultiple(@Body() createMedicineDto: CreateMedicineDto[],@Req() req:ExpressRequest) {
    
    
    return this.medicineService.uploadBulkFile(createMedicineDto,req.user.slug);
  }

  @Get()
  findAll(@Query() query:getAllMedicineDto,@Req() req:ExpressRequest) {
    return this.medicineService.findAll(query,req.user.slug);
  }
  @Get('get-all-with-pagination')
  findAllWithPagination(@Query() query:PaginationDto,@Req() req:ExpressRequest) {
    return this.medicineService.findWithPagination(query,req.user.slug);
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
