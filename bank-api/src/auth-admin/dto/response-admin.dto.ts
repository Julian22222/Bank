import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AdminResponseDto {
  @IsNumber()
  admin_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Admin Role is required' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  admin_name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

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

  @IsNotEmpty({ message: 'DOB is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob: Date;

  @IsDateString()
  created_at: string;
}
