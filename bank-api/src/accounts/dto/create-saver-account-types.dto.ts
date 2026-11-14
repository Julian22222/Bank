import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSaverAccountTypesDto {
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
}
