// src/schemas/shop-stock-batch.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Medicine } from 'src/medicine/entities/medicine.schema';


export type ShopStockBatchDocument = HydratedDocument<ShopStockBatch>;

@Schema({ timestamps: true })
export class ShopStockBatch {
  @Prop({ type: Types.ObjectId,  required: true })
  shopMedicineId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true,index: true })
  expiryDate: Date;

  @Prop({ required: true })
  price: number;

  @Prop({
    default: () => 'B-' + Math.floor(Math.random() * 10000000).toString(),
  })
  batchNumber: string;
}

export const ShopStockBatchSchema =
  SchemaFactory.createForClass(ShopStockBatch);



