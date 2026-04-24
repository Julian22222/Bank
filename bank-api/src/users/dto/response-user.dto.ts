import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserResponseDto {
  @IsNumber()
  customer_id: number;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  last_name: string;

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
