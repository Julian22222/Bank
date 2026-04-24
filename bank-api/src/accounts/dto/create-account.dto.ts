import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Account type is required' })
  account_type: string;

  @IsString()
  @IsNotEmpty()
  account_nr: string;
}
