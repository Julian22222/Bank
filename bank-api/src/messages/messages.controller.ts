import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageDto } from './dto/message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(): Promise<MessageDto[]> {
    return this.messagesService.findAll();
  }

  @Get('user/:userId')
  findUserMessages(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MessageDto[] | null> {
    return this.messagesService.findAllUserMessages(userId);
  }

  @Get(':messageId')
  findOne(
    @Param('messageId', ParseIntPipe) messageId: number,
  ): Promise<MessageDto> {
    return this.messagesService.findOne(messageId);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto): Promise<MessageDto> {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':messageId')
  update(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<MessageDto> {
    return this.messagesService.update(messageId, updateMessageDto);
  }

  @Delete(':messageId')
  remove(
    @Param('messageId', ParseIntPipe) messageId: number,
  ): Promise<{ message: string }> {
    return this.messagesService.remove(messageId);
  }
}
