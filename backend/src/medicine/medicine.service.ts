import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineDto, getAllMedicineDto, PaginationDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import { InjectModel } from '@nestjs/mongoose';
import { Medicine, MedicineDocument, MedicineSchema } from './entities/medicine.schema';
import { Model } from 'mongoose';
import slugify from '@sindresorhus/slugify';
import pLimit from 'p-limit';

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
      const getAllMedicin = await getMedicineModel.find().sort({name:1}).lean().limit(30);
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
  async findWithPagination (query:PaginationDto){
    const getMedicineModel = await this.tenantConnectionService.getModel("pharmicy-1",Medicine.name,MedicineSchema)
   const { name, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

       let searchQuery: any = {};
         if (name) {
      // Text search if available, otherwise regex search
      searchQuery.$text = { $search: name };
    }
    const [data, count] = await Promise.all([
       await getMedicineModel
        .find(searchQuery)
        .sort({  createdAt: -1,name:-1 })
        .skip(skip)
        .limit(limit)
        .lean(),
        await getMedicineModel.countDocuments(searchQuery)
    ])

      const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
       
    return {
      data,
      totalCount:count,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };

  }

async uploadBulkFile(medicines: CreateMedicineDto[]) {
  // Generate slugs for all medicines first
  const medicinesWithSlugs = medicines.map(medicine => {
    const rawSlug = `${medicine.name}-${medicine.dosageType}-${medicine.generic}-${medicine.strength}-${medicine.manufacturer}`;
    return {
      ...medicine,
      slug: slugify(rawSlug) // Add slug options as needed
    };
  });

  const limit = pLimit(5);
  const batchSize = 1000;
  const batches: CreateMedicineDto[][] = [];
  
  for (let i = 0; i < medicinesWithSlugs.length; i += batchSize) {
    batches.push(medicinesWithSlugs.slice(i, i + batchSize));
  }

  const getMedicineModel = await this.tenantConnectionService.getModel<MedicineDocument>(
    "pharmicy-1",
    Medicine.name,
    MedicineSchema
  );

  const insertPromises = batches.map(batch =>
    limit(() => getMedicineModel.insertMany(batch, { ordered: false }))
  );

  const results = await Promise.allSettled(insertPromises);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  this.logger.log("insertedBatches", successful, "failedBatches", failed);

  return {
    success: failed === 0,
    insertedBatches: successful,
    failedBatches: failed,
  };
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
