import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicineModule } from './medicine/medicine.module';
import { MongooseModule } from '@nestjs/mongoose';

import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { TenantConnectionModule } from './tenant-connection/tenant-connection.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from './shop/shop.module';
import { SellsModule } from './sells/sells.module';

@Module({
  imports: [    ConfigModule.forRoot({
    isGlobal:true
  }),
  JwtModule.register({
    global: true,
        secret: process.env.jwt ,
    signOptions: { expiresIn: '5d' },
  }),
     MongooseModule.forRoot(process.env.MONGODB_URL as string, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      onConnectionCreate: (connection) => {
        connection.on('connected', () => console.log('MongoDB connected'));
        connection.on('error', (err) => console.log('MongoDB error:', err));
        return connection;
      },
    })
   , MedicineModule, TenantConnectionModule, UserModule, ShopModule, SellsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
