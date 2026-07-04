import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
// import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard) // This route is protected, only accessible with a valid JWT
  //JwtAuthGuard verifies the token. If valid, it calls the validate() method in JwtStrategy, which returns the payload (user info) and attaches it to req.user.
  //Then you can access req.user in your controller method to get the current user's info.
  getCurrentUser(@Req() req) {
    console.log(
      'FROM UsersController - Current user from JWT payload:',
      req.user,
    );

    return this.usersService.findOne(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  // @Post('login')
  // login(@Body() loginData: LoginDto) {
  //   return this.usersService.login(loginData);
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  //Can be used with JWT Auth Guard
  @Patch(':id')
  updateUserDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  //Edit password for the currently logged-in user (authenticated via JWT)
  @Patch('password')
  @UseGuards(JwtAuthGuard)
  userPasswordUpdate(
    @Req() req,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<object> {
    return this.usersService.updatePassword(
      req.user.sub,
      updatePasswordUserDto,
    );
  }

  //Edit password for a specific user by ID (admin functionality)
  @Patch(':id/password')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<object> {
    return this.usersService.updatePassword(id, updatePasswordUserDto);
  }

  //Can be used with JWT Auth Guard
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
