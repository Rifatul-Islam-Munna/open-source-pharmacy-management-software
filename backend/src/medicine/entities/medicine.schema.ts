import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type MedicineDocument = HydratedDocument<Medicine>;
 export enum DosageType {
   Tablet = 'Tablet',
   Syrup = 'Syrup',
   Capsule = 'Capsule',
   Injection = 'Injection',
   Other = 'Other',
 }
@Schema({timestamps:true,autoIndex:true})

export class Medicine {
 @Prop({text:true,index:true,required:true})
 name:string;
 
 @Prop({type: String, enum: DosageType})
 dosageType:DosageType;

 @Prop()
 generic:string;
 
 @Prop()
 strength:string;

 @Prop()
 manufacturer:string;
 @Prop()
 UnitPrice:string;

 @Prop()
 PackageSize:string;

 @Prop({unique:true,index:true})
 slug:string;





}

export const MedicineSchema = SchemaFactory.createForClass(Medicine);


