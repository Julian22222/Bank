import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  account_id: number;

  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Money amout you add or withdraw is required' })
  money_amount: number; // DECIMAL

  @IsNumber()
  @IsNotEmpty({ message: 'Balance is required' })
  balance: number; // DECIMAL

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  details: string;
}
