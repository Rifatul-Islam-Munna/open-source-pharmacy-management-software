// src/schemas/shop-stock-batch.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Medicine } from 'src/medicine/entities/medicine.schema';


export type ShopStockBatchDocument = HydratedDocument<ShopStockBatch>;

@Schema({ timestamps: false, _id: false })
export class ShopBatchQuantity {
@Prop()
boxes: number;
@Prop()
cartonPerBox: number;
@Prop()
stripsPerCarton: number;
@Prop()
unitsPerStrip: number;

}

@Schema({ timestamps: true })
export class ShopStockBatch {
  @Prop({ type: Types.ObjectId })
  shopMedicineId: Types.ObjectId;

 

  @Prop({ required: true,index: true })
  expiryDate: Date;

  @Prop({ required: true })
  sellingPrice: number;
  @Prop({ required: true })
  purchasePrice: number;

  @Prop({
    default: () => 'B-' + Math.floor(Math.random() * 10000000).toString(),
  })
  batchNumber: string;

    @Prop({text:true,index:true})
  name:string;

@Prop()
totalUnits:number;

 @Prop({type:ShopBatchQuantity})
 quantity:ShopBatchQuantity

}

export const ShopStockBatchSchema =
  SchemaFactory.createForClass(ShopStockBatch);



