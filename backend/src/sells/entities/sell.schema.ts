// src/schemas/sale.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type SaleDocument = HydratedDocument<Sale>;

@Schema({ _id: true, timestamps: true })
export class SaleItem {
  @Prop({ type: Types.ObjectId,  required: true })
  medicineId: Types.ObjectId;

  @Prop()
  batchId: string;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[];

  @Prop({ required: true })
  customerName: string;

  @Prop()
  mobileNumber?: string;

  @Prop()
  address?: string;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true })
  totalAmount: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);


