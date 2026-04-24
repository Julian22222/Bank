import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Customer Id is required' })
  customer_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Message subject is required' })
  msg_subject: string;

  @IsString()
  @IsOptional()
  msg_status: string;

  @IsString()
  @IsNotEmpty({ message: 'Text is required' })
  msg_body: string;

  @IsString()
  @IsNotEmpty({ message: 'Message created by is required' })
  msg_created_by: string;
}
