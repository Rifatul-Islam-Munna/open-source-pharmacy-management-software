import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, ResetPassword } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'lib/pagination.dto';
import { AuthGuard, type  ExpressRequest } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserType } from './entities/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('create-worker-user')
  @UseGuards(AuthGuard)
  @Roles(UserType.ADMIN,UserType.EDITOR)
  createWorkerUser(@Body() createUserDto: CreateUserDto,@Req() req:ExpressRequest) {
    return this.userService.createWorker(createUserDto,req.user);
  }
  @Post('signin-user')
  signin(@Body() createUserDto: LoginUserDto) {
    return this.userService.signIn(createUserDto);
  }

  @Get('find-all-user')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserType.ADMIN,UserType.EDITOR)
 
  findAll(@Query() query:PaginationDto,@Req() req:ExpressRequest) {
    return this.userService.findAll(query,req.user.id);
  }

 

  @Patch('update-user')
  @UseGuards(AuthGuard,RolesGuard)

  update( @Body() updateUserDto: ResetPassword,@Req() req:ExpressRequest) {
    return this.userService.resetPassword( updateUserDto,req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
