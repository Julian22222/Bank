import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdatePasswordAdminDto } from './dto/update-password.dto';
import { AdminResponseDto } from './dto/response-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Get()
  // checkServer() {
  //   return 'Admin API is working!';
  // }

  @Get()
  findAll(): Promise<AdminResponseDto[]> {
    return this.adminService.findAll();
  }

  @Get(':adminId')
  findOne(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<AdminResponseDto> {
    return this.adminService.findOne(adminId);
  }

  @Post()
  createNewAccount(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  @Patch(':adminId')
  updateAdminDetails(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.update(adminId, updateAdminDto);
  }

  @Patch(':adminId/password')
  updateAdminPassword(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updatePasswordDto: UpdatePasswordAdminDto,
  ) {
    return this.adminService.updatePassword(adminId, updatePasswordDto);
  }

  @Delete(':adminId')
  remove(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<{ message: string }> {
    return this.adminService.remove(adminId);
  }
}
