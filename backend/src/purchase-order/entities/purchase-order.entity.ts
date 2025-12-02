import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PurchaseOrderDocument = PurchaseOrder & Document;

@Schema({ timestamps: true })
export class PurchaseOrder {


  @Prop({ required: true,text:true,index:true })
  medicine: string; 

  @Prop({min: 1,index:true })
  box: number;
  @Prop({min: 1,index:true })
  quantity: number;

  @Prop({ enum: ['pending', 'ordered', 'received',"cancelled"], default: 'pending' ,index:true })
  status: 'pending' | 'ordered' | 'received';


}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
