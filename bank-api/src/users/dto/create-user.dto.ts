import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
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

  @IsNotEmpty({ message: 'DOB is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob: string;
}
