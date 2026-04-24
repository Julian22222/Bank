import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  admin_name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @Matches(/^[0-9+\-\s()]+$/, {
    message: 'Phone number contains invalid characters',
  })
  @IsNotEmpty({ message: 'Phone nr. is required' })
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  customer_address: string;

  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'DOB is required' })
  dob: string;
}
