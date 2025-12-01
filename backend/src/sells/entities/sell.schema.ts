// src/schemas/sale.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SaleDocument = HydratedDocument<Sale>;

export type DiscountType = 'percentage' | 'fixed';
export type PaymentStatus = 'paid' | 'due';

@Schema({ _id: false })
export class SaleItem {
  @Prop({ type: Types.ObjectId, required: true })
  medicineId: Types.ObjectId;

  @Prop({ required: true })
  medicineName: string;

  @Prop({ required: true })
  price: number; // original price

  @Prop()
  discountPrice?: number; // effective unit price after item-level discount

  @Prop({ enum: ['percentage', 'fixed'], required: false })
  itemDiscountType?: DiscountType;

  @Prop({ required: false })
  itemDiscountValue?: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  subtotal: number; // effectiveUnitPrice * quantity

  @Prop()
  stock: number;

  @Prop()
  originalPrice: number;

  @Prop()
  doesType?: string;

  // Optional if you actually track batch/expiry per item
  @Prop()
  batchId?: string;

  @Prop()
  expiryDate?: Date;


}

@Schema({ timestamps: true ,autoIndex: true,autoSearchIndex: true})
export class Sale {
  @Prop({ type: [SaleItem], required: true })
  items: SaleItem[];

  @Prop()
  subtotal: number;  // this subtotal is after the discount product

  @Prop({ enum: ['percentage', 'fixed'], required: true })
  discountType: DiscountType;

  @Prop()
  discountValue: number;

  @Prop()
  discountAmount: number; // discount from invoice-level discountType/value

  @Prop()
  itemsDiscount: number; // total of per-item discounts

  @Prop()
  totalDiscount: number; // itemsDiscount + discountAmount

  @Prop({ required: true })
  total: number;

  @Prop({ enum: ['paid', 'due'], required: true })
  paymentStatus: PaymentStatus;

  @Prop()
  paidAmount: number;

  @Prop()
  customerName?: string;

  @Prop({sparse: true})
  customerPhone?: string;

  @Prop()
  issuedBy?: string;

  @Prop()
  transactionId?: string;

  @Prop({ required: true , index:true})
  paymentType: string;

  @Prop()
  invoiceId?: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

SaleSchema.index(
  { customerName: 'text', customerPhone: 'text', invoiceId: 'text' },
  { name: 'customer_search_text' },
);