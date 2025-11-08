import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenantConnectionService } from './tenant-connection.service';
import { CreateTenantConnectionDto } from './dto/create-tenant-connection.dto';
import { UpdateTenantConnectionDto } from './dto/update-tenant-connection.dto';

@Controller('tenant-connection')
export class TenantConnectionController {
  constructor(private readonly tenantConnectionService: TenantConnectionService) {}

  
}
