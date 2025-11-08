import { Global, Module } from '@nestjs/common';
import { TenantConnectionService } from './tenant-connection.service';
import { TenantConnectionController } from './tenant-connection.controller';


@Global()
@Module({
  controllers: [TenantConnectionController],
  providers: [TenantConnectionService],
  exports: [TenantConnectionService],
})
export class TenantConnectionModule {}
