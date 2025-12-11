import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type MedicineDocument = HydratedDocument<Medicine>;
 
export enum DosageType {
  Capsule = 'Capsule',
  CapsuleControlledRelease = 'Capsule (Controlled Release)',
  CapsuleDelayedRelease = 'Capsule (Delayed Release)',
  CapsuleExtendedRelease = 'Capsule (Extended Release)',
  CapsuleModifiedRelease = 'Capsule (Modified Release)',
  CapsuleSustainedRelease = 'Capsule (Sustained Release)',
  CapsuleTimedRelease = 'Capsule (Timed Release)',
  ChewableTablet = 'Chewable Tablet',
  ChewingGumTablet = 'Chewing Gum Tablet',
  Cream = 'Cream',
  DentalGel = 'Dental Gel',
  DialysisSolution = 'Dialysis Solution',
  DispersibleTablet = 'Dispersible Tablet',
  EarDrop = 'Ear Drop',
  EffervescentGranules = 'Effervescent Granules',
  EffervescentPowder = 'Effervescent Powder',
  EffervescentTablet = 'Effervescent Tablet',
  EmulsionForInfusion = 'Emulsion for infusion',
  EyeCapsule = 'Eye Capsule',
  FlashTablet = 'Flash Tablet',
  Gel = 'Gel',
  HandRub = 'Hand Rub',
  IMInjection = 'IM Injection',
  IMIAInjection = 'IM/IA Injection',
  IMIVInjection = 'IM/IV Injection',
  IMSCInjection = 'IM/SC Injection',
  IVInfusion = 'IV Infusion',
  IVInjection = 'IV Injection',
  IVInjectionOrInfusion = 'IV Injection or Infusion',
  IVSCInjection = 'IV/SC Injection',
  InhalationCapsule = 'Inhalation Capsule',
  Inhaler = 'Inhaler',
  Injection = 'Injection',
  IntraArticularInjection = 'Intra-articular Injection',
  IntracameralInjection = 'Intracameral Injection',
  IntraspinalInjection = 'Intraspinal Injection',
  IntratrachealSuspension = 'Intratracheal Suspension',
  IntravitrealInjection = 'Intravitreal Injection',
  IrrigationSolution = 'Irrigation Solution',
  Liquid = 'Liquid',
  LiquidCleanserSoap = 'Liquid Cleanser Soap',
  LongActingInjection = 'Long Acting Injection',
  LongActingTablet = 'Long Acting Tablet',
  Lotion = 'Lotion',
  MUPSTablet = 'MUPS Tablet',
  MedicatedBar = 'Medicated Bar',
  Microgranules = 'Microgranules',
  Mouthwash = 'Mouthwash',
  MuscleRub = 'Muscle Rub',
  NailLacquer = 'Nail Lacquer',
  NasalDrop = 'Nasal Drop',
  NasalOintment = 'Nasal Ointment',
  NasalSpray = 'Nasal Spray',
  NebuliserSolution = 'Nebuliser Solution',
  NebuliserSuspension = 'Nebuliser Suspension',
  OROSTablet = 'OROS Tablet',
  OcularSpray = 'Ocular Spray',
  Ointment = 'Ointment',
  OphthalmicEmulsion = 'Ophthalmic Emulsion',
  OphthalmicGel = 'Ophthalmic Gel',
  OphthalmicOintment = 'Ophthalmic Ointment',
  OphthalmicSolution = 'Ophthalmic Solution',
  OphthalmicSuspension = 'Ophthalmic Suspension',
  OralEmulsion = 'Oral Emulsion',
  OralGel = 'Oral Gel',
  OralPaste = 'Oral Paste',
  OralPowder = 'Oral Powder',
  OralSolubleFilm = 'Oral Soluble Film',
  OralSolution = 'Oral Solution',
  OralSuspension = 'Oral Suspension',
  PediatricDrops = 'Pediatric Drops',
  PowderForInjection = 'Powder for Injection',
  PowderForSolution = 'Powder for Solution',
  PowderForSuspension = 'Powder for Suspension',
  RectalOintment = 'Rectal Ointment',
  RectalSaline = 'Rectal Saline',
  RespiratorSolution = 'Respirator Solution',
  RetardTablet = 'Retard Tablet',
  SCInjection = 'SC Injection',
  ScalpLotion = 'Scalp Lotion',
  ScalpOintment = 'Scalp Ointment',
  ScalpSolution = 'Scalp Solution',
  Shampoo = 'Shampoo',
  Solution = 'Solution',
  SolutionForInhalation = 'Solution for Inhalation',
  SprinkleCapsule = 'Sprinkle Capsule',
  SublingualTablet = 'Sublingual Tablet',
  Suppository = 'Suppository',
  SurgicalScrub = 'Surgical Scrub',
  Syrup = 'Syrup',
  Tablet = 'Tablet',
  TabletControlledRelease = 'Tablet (Controlled Release)',
  TabletDelayedRelease = 'Tablet (Delayed Release)',
  TabletEntericCoated = 'Tablet (Enteric Coated)',
  TabletExtendedRelease = 'Tablet (Extended Release)',
  TabletImmediateRelease = 'Tablet (Immediate Release)',
  TabletModifiedRelease = 'Tablet (Modified Release)',
  TabletProlongedRelease = 'Tablet (Prolonged Release)',
  TabletSustainedRelease = 'Tablet (Sustained Release)',
  TopicalGel = 'Topical Gel',
  TopicalPowder = 'Topical Powder',
  TopicalSolution = 'Topical Solution',
  TopicalSpray = 'Topical Spray',
  TopicalSuspension = 'Topical Suspension',
  TransdermalPatch = 'Transdermal Patch',
  VaginalCream = 'Vaginal Cream',
  VaginalGel = 'Vaginal Gel',
  VaginalPessary = 'Vaginal Pessary',
  VaginalSuppository = 'Vaginal Suppository',
  VaginalTablet = 'Vaginal Tablet',
  ViscoelasticSolution = 'Viscoelastic Solution',
  ViscousEyeDrop = 'Viscous Eye Drop',
  Other = 'Other'
}



@Schema({timestamps:true})


export class Medicine {
 @Prop({required:true,text:true})
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

MedicineSchema.index({ name: 'text' });
