import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileMulter } from 'src/utils/multerOptions';
import { Request } from 'express';
import { WsGateway } from 'src/gateway/gateway';

@UseGuards(AuthenticationGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly socket: WsGateway,
  ) {}

  @UseInterceptors(FilesInterceptor('files', 20, uploadFileMulter))
  @Post()
  async create(
    @Req() request: Request,
    @Body() body: CreateMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const message = await this.messagesService.create(request, body, files);

    this.socket.onNewMessage(body, request, message);

    return message;
  }
}
