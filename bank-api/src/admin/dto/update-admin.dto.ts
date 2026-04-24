import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  admin_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  customer_address?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
  // no password
}
