import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineDto, getAllMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { InjectModel } from '@nestjs/mongoose';
import { Medicine, MedicineDocument, MedicineSchema } from './entities/medicine.schema';
import { Model } from 'mongoose';
import slugify from '@sindresorhus/slugify';

@Injectable()
export class MedicineService {
  private logger = new Logger(MedicineService.name);
  constructor(private tenantConnectionService:TenantConnectionService, @InjectModel(Medicine.name) private medicineModel:Model<MedicineDocument>){}
  async create(createMedicineDto: CreateMedicineDto) {
    const rawSlug = `${createMedicineDto.name}-${createMedicineDto.dosageType}-${createMedicineDto.generic}-${createMedicineDto.strength}-${createMedicineDto.manufacturer}`;

    const slug = slugify(rawSlug)
    const random = Math.floor(Math.random() * 100);

    const finalData ={
      ...createMedicineDto,
      slug:slug
    }
    const getMedicineModel = await this.tenantConnectionService.getModel("pharmicy-1",Medicine.name,MedicineSchema)


    const create = await getMedicineModel.create(finalData);

    
    
    return create;
  }

  async findAll(query:getAllMedicineDto) {
    const {name} = query
    const getMedicineModel = await this.tenantConnectionService.getModel("pharmicy-1",Medicine.name,MedicineSchema)
     if (!name) {
      const getAllMedicin = await getMedicineModel.find().sort({name:1}).lean().limit(20);
      return getAllMedicin
    
  }
    
      const getAllMedicin = await getMedicineModel
  .find({ $text: { $search: name } })
  .select({ score: { $meta: "textScore" } })
  .sort({ score: { $meta: "textScore" } })
  .limit(20)
  .lean();
      return getAllMedicin
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicine`;
  }
}
