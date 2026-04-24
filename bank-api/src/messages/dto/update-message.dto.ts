import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsNumber()
  customer_id?: number;

  @IsOptional()
  @IsString()
  msg_subject?: string;

  @IsOptional()
  @IsString()
  msg_status?: string;

  @IsOptional()
  @IsString()
  msg_body?: string;

  @IsOptional()
  @IsString()
  msg_created_by?: string;
}
