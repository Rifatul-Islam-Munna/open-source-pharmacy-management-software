import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, ResetPassword } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantConnectionService } from 'src/tenant-connection/tenant-connection.service';
import slugify from '@sindresorhus/slugify';
import { GLOBALDATABSE } from 'lib/helper';
import { User, UserDocument, UserSchema, UserType } from './entities/user.schema';
import { PaginationDto } from 'lib/pagination.dto';
import { jwts } from 'src/auth/auth.guard';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
  constructor(private jwtService: JwtService, private tenantConnectionService:TenantConnectionService){}
 async create(createUserDto: CreateUserDto) {
  const rawSlug = `${createUserDto.ownerName}-${createUserDto.shopName}-${createUserDto.location}`;

  const slug = slugify(rawSlug)
  const findUserModel = this.tenantConnectionService.getModel(GLOBALDATABSE,User.name,UserSchema)

  const findIsUserThere = await findUserModel.exists({$or:[{email:createUserDto.email},{slug:slug}]}).exec();
  if(findIsUserThere){
    throw new HttpException('User already exists', 400);
  }
  const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const finalData ={
      ...createUserDto,
      password:passwordHash,
      slug:slug
    }
    const create = await findUserModel.create(finalData);
    if(!create){
      throw new HttpException('User not created', 400);
    }


    return {message:'User created successfully',data:create};
  }

  async createWorker(createUserDto: CreateUserDto,user:jwts){
     const rawSlug = `${createUserDto.workerName}-${user.slug}`;

  const slug = slugify(rawSlug)
  const findUserModel = this.tenantConnectionService.getModel(GLOBALDATABSE,User.name,UserSchema)
   
   

  const findIsUserThere = await findUserModel.exists({$or:[{email:createUserDto.email},{slug:slug}]}).exec();
  if(findIsUserThere){
    throw new HttpException('User already exists', 400);
  }
  const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const finalData ={
      workerName:createUserDto.workerName,
      workerSlug:user.slug,
      slug:slug,
      type:UserType.WORKER,

      password:passwordHash,
      shopId:user.id,
      email:createUserDto.email,
      shopName:user.shopName,
      location:user.location,
      mobileNumber:user.mobileNumber
     
    }
    this.logger.log(finalData)
    const create = await findUserModel.create(finalData);
    if(!create){
      throw new HttpException('User not created', 400);
    }


    return {message:'User created successfully',data:create};

  }

  async signIn(login:LoginUserDto){

       const findUserModel = this.tenantConnectionService.getModel<UserDocument>(GLOBALDATABSE,User.name,UserSchema)
        const user = await findUserModel.findOne({email:login.email}).lean();
    if(!user){
      throw new HttpException('User not found', 400);
    }
    const isMatch = await bcrypt.compare(login.password,user.password);
    if(!isMatch){
      throw new HttpException('Invalid credentials', 400);
    }
    const userSlug = user?.type === UserType.WORKER || user?.type === UserType.USER ? user.workerSlug : user.slug
    const access_token = this.jwtService.sign({email:user.email,id:user._id,role:user.type,slug:userSlug,shopName:user.shopName,location:user.location,mobileNumber:user.mobileNumber},{expiresIn:"10d",secret:process.env.ACCESS_TOKEN});
    const refresh_token = this.jwtService.sign({email:user.email,id:user._id,role:user.type,slug:userSlug,shopName:user.shopName,location:user.location,mobileNumber:user.mobileNumber},{expiresIn:"30d",secret:process.env.REFRESH_TOKEN});
    return{
      message:'User logged in successfully',
      access_token,
      refresh_token,
      user:user
    }
  }


  async resetPassword(payload:ResetPassword,user:jwts){
    const findUserModel = this.tenantConnectionService.getModel<UserDocument>(GLOBALDATABSE,User.name,UserSchema)
    const findUser = await findUserModel.findOne({_id:user.id}).lean();
    if(!findUser){
      throw new HttpException('User not found', 400);
    }
    const isMatch = await bcrypt.compare(payload.oldPassword,findUser.password);
    if(!isMatch){
      throw new HttpException('Old password is incorrect', 400);
    }
    const passwordHash = await bcrypt.hash(payload.newPassword, 10);
    const update = await findUserModel.updateOne({_id:user.id},{$set:{password:passwordHash}}).lean();
    if(!update){
      throw new HttpException('User not updated', 400);
    }
    return {message:'User password updated successfully',data:update}
  }

  async findAll(query: PaginationDto,userId:string) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    id,
    slug,
  } = query;
  

  const model = this.tenantConnectionService.getModel<UserDocument>(
    GLOBALDATABSE,
    User.name,
    UserSchema,
  );

  const filter: any = {shopId:userId};

 
  if (id) {
    filter._id = id;
  }

 
  if (slug) {
    filter.slug = slug;
  }

  const skip = (page - 1) * limit;

 
  const total = await model.countDocuments(filter);

  
  const data = await model
    .find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}




  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
