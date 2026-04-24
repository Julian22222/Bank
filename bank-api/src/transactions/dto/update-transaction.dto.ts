import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  account_id?: number;

  @IsOptional()
  @IsNumber()
  customer_id?: number;

  @IsOptional()
  @IsNumber()
  money_amount?: number; // DECIMAL

  @IsOptional()
  @IsNumber()
  balance?: number; // DECIMAL

  @IsOptional()
  @IsString()
  details?: string;
}
