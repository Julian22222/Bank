import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaverAccountTypesDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Account name is required' })
  account_name: string;

  @IsNumber()
  @IsNotEmpty()
  interest: number;

  @IsNumber()
  @IsNotEmpty()
  money_limit: number;

  @IsNumber()
  @IsNotEmpty()
  account_duration: number;

  @IsString()
  @IsNotEmpty()
  created_at: string;
}
