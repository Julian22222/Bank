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
import { AdminLoginDto } from './dto/admin_login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard) // This route is protected, only accessible with a valid JWT
  //JwtAuthGuard verifies the token. If valid, it calls the validate() method in JwtStrategy, which returns the payload (user info) and attaches it to req.user.
  //Then you can access req.user in your controller method to get the current user's info.
  getCurrentAdmin(@Req() req) {
    console.log(
      'FROM AdminController - Current admin from JWT payload:',
      req.user,
    );

    return this.adminService.findOne(req.user.sub);
  }

  @Get(':adminId')
  findOne(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<AdminResponseDto> {
    return this.adminService.findOne(adminId);
  }

  @Get()
  findAll(): Promise<AdminResponseDto[]> {
    return this.adminService.findAll();
  }

  @Get('user-registration')
  findAllUsersToRegister() {
    return this.adminService.findUsersToRegister();
  }

  @Post('login')
  login(@Body() loginData: AdminLoginDto) {
    return this.adminService.login(loginData);
  }

  @Post()
  createNewAccount(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.create(createAdminDto);
  }

  //Can be used with JWT Auth Guard to update the current admin's details without needing to provide the adminId in the URL.
  @Patch(':adminId')
  updateAdminDetails(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.update(adminId, updateAdminDto);
  }

  //Can be used with JWT Auth Guard to update the current admin's password without needing to provide the adminId in the URL.
  @Patch(':adminId/password')
  updateAdminPassword(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updatePasswordDto: UpdatePasswordAdminDto,
  ) {
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
  remove(
    @Param('adminId', ParseIntPipe) adminId: number,
  ): Promise<{ message: string }> {
    return this.adminService.remove(adminId);
  }
}
