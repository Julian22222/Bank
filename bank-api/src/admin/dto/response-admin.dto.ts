import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AdminResponseDto {
  @IsNumber()
  admin_id: number;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  admin_name: string;

  @IsNotEmpty()
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

  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'DOB is required' })
  dob: Date;

  @IsDateString()
  created_at: Date;
}
