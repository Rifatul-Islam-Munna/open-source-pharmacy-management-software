import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { MedicineController } from './medicine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medicine, MedicineSchema } from './entities/medicine.schema';

@Module({
  imports: [MongooseModule.forFeature([{name:Medicine.name,schema:MedicineSchema}])],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
