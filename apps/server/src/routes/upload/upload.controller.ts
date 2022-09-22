import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { readFileSync, unlink } from 'fs';
import { diskStorage } from 'multer';
import { supabase } from '../../services/supabase';
import { decode } from 'base64-arraybuffer';
import { BaseGuard } from 'src/guards/base.guard';
import { verifyJWT } from 'src/helpers/jwt';

@Controller('upload')
@UseGuards(BaseGuard)
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('authorization') auth: string,
  ) {
    const userId = verifyJWT(auth);
    if (!userId)
      throw new UnauthorizedException(
        undefined,
        "You're not allowed to perform this action.",
      );
    const fileContent = readFileSync(`${process.cwd()}/${file.path}`, 'base64');

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${userId}-${file.filename}`, decode(fileContent), {
        contentType: file.mimetype,
      });
    unlink(
      `${process.cwd()}/${file.path}`,
      (err) => err && console.log(`${err.message}`),
    );
    console.log(error);
    if (error) {
      throw new BadRequestException(undefined, error.message);
    }
    return {
      path: data.Key,
    };
  }
}
