import { HttpException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

const whiteList: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/jp2',
  'image/heif',
  'image/heic',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-msvideo',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.oasis.opendocument.text',
  'application/rtf',
];

const imageWhitelist: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/jp2',
  'image/heif',
  'image/heic',
];

export const uploadFileMulter = {
  limits: {
    fileSize: 20971520,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (whiteList.includes(file.mimetype)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type`, 400), false);
    }
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Create folder if doesn't exist
      if (!existsSync('./uploads')) {
        mkdirSync('./uploads');
      }
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
};

export const uploadProfilePicture = {
  limits: {
    fileSize: 20971520,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (imageWhitelist.includes(file.mimetype)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type`, 400), false);
    }
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Create folder if doesn't exist
      if (!existsSync('./uploads')) {
        mkdirSync('./uploads');
      }
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  }),
};
