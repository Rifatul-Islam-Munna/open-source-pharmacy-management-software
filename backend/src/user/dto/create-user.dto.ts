
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';


export class CreateUserDto {
  

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  ownerName: string;

  @ApiProperty({ example: 'HealthPlus Pharmacy' })
  @IsString()
  @IsOptional()
  shopName: string;


  @ApiProperty({ example: 'wroker name' })
  @IsString()
  @IsOptional()
  workerName: string;
 

  @ApiProperty({ example: 'HealthPlus Pharmacy' })
  @IsString()
  @IsOptional()
  mobileNumber: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({ example: 'owner@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false, example: '103.145.120.22' })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
export class LoginUserDto {
    @ApiProperty({
      description: 'The email of the user',
      example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
  
    @ApiProperty({
      description: 'The password of the user',
      example: 'Password123!',
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }