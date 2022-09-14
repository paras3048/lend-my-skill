import { Controller, Get, Param, Res, Response } from '@nestjs/common';
import axios from 'axios';
import { Response as ExpressResponse } from 'express';
import { AppService } from './app.service';
import { supabase } from './services/supabase';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @Get('images/public/:image')
  // async getFile(
  //   @Param() param: { image: string },
  //   @Response() res: ExpressResponse,
  // ) {
  //   const { data, publicURL, error } = await supabase.storage
  //     .from('images')
  //     .getPublicUrl(param.image);
  //   const blob = await axios
  //     .get(
  //       'https://gidarlqvtgfemzychhus.supabase.co/storage/v1/object/public/images/public/1661191655098-1e88f5ea-2c56-412a-8df7-f3b786536a27-myself.jpg',
  //     )
  //     .catch(() => null);
  //   if (blob.data !== null) {
  //     return res
  //       .status(200)
  //       .setHeader('content-type', blob.headers['content-type'])
  //       .send(blob.data);
  //   }

  //   return null;
  // }
}
