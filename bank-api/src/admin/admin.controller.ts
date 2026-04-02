import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('allUsers')
  findAll() {
    return this.adminService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findUser(+id);
  }

  @Get('allAccounts')
  findAllAccounts() {
    return this.adminService.getAllAccounts();
  }

  @Get('allTransactions')
  findAllTransactions() {
    return this.adminService.getAllTransactions();
  }

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
