import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileMulter } from 'src/utils/multerOptions';
import { Request } from 'express';

@UseGuards(AuthenticationGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseInterceptors(FileInterceptor('file', uploadFileMulter))
  @Post()
  async create(
    @Body() body: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const message = await this.messagesService.create(request, body, file);

    return message;
  }
}
