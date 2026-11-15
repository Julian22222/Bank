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
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdatePasswordAdminDto } from './dto/update-password.dto';
import { AdminResponseDto } from './dto/response-admin.dto';
import { JwtAdminGuard } from '../auth-admin/jwt-auth.guard';
import { JwtAuthRole } from '../auth-admin/jwt-auth-role.guard';
import { RolesGuard } from '../auth-admin/roles.guard';
import { Roles } from '../auth-admin/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  @UseGuards(JwtAdminGuard) // This route is protected, only accessible with a valid JWT
  //JwtAuthGuard verifies the token. If valid, it calls the validate() method in JwtStrategy, which returns the payload (user info) and attaches it to req.user.
  //Then you can access req.user in your controller method to get the current user's info.
  getCurrentAdmin(@Req() req): Promise<AdminResponseDto> {
    console.log(
      'FROM AdminController - Current admin from JWT payload:',
      req.user,
    );

    return this.adminService.findOne(req.user.sub);
  }

  @Get()
  findAll(): Promise<AdminResponseDto[]> {
    return this.adminService.findAll();
  }

  @Get('user-registration')
  findAllUsersToRegister() {
    return this.adminService.findUsersToRegister();
  }

  @Get(':adminId')
  findOne(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<AdminResponseDto> {
    return this.adminService.findOne(adminId);
  }

  @Post()
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles('superAdmin')
  async createNewAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    const createdAdmin = await this.adminService.create(createAdminDto);

    return {
      ...createdAdmin,
      role: createdAdmin?.role ?? createAdminDto.role ?? 'admin',
    };
  }

  //Can be used with JWT Auth Guard to update the current admin's details without needing to provide the adminId in the URL.
  @Patch(':adminId')
  @UseGuards(JwtAdminGuard)
  updateAdminDetails(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.update(adminId, updateAdminDto);
  }

  //Can be used with JWT Auth Guard to update the current admin's password without needing to provide the adminId in the URL.
  @Patch(':adminId/update-password')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles('superAdmin')
  updateAdminPassword(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updatePasswordDto: UpdatePasswordAdminDto,
  ): Promise<{ message: string }> {
    return this.adminService.updatePassword(adminId, updatePasswordDto);
  }

  @Delete('user-registration/:registrationId')
  removeUserFromRegister(
    @Param('registrationId', ParseIntPipe) registrationId: number,
  ): Promise<{ message: string }> {
    return this.adminService.removeUserFromRegister(registrationId);
  }

  //Can be used with JWT Auth Guard
  @Delete(':adminId')
  @UseGuards(JwtAdminGuard, RolesGuard)
  @Roles('superAdmin')
  remove(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<{ message: string }> {
    return this.adminService.remove(adminId);
  }
}
