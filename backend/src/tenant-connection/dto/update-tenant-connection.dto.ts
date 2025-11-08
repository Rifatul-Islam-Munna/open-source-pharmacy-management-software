import { PartialType } from '@nestjs/swagger';
import { CreateTenantConnectionDto } from './create-tenant-connection.dto';

export class UpdateTenantConnectionDto extends PartialType(CreateTenantConnectionDto) {}
