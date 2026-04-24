import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
