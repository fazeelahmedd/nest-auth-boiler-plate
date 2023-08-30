import { ResponseMessage } from '../../common/messages';
import { HttpStatus } from '@nestjs/common';
export class ResponseController {
  // private getResponse = (res: Response, data: iResponseJson) => {
  //   return res.status(data.code).json(data);
  // };

  protected CreatedResponse = (data: any, message?: string) => {
    return {
      data: data,
      code: HttpStatus.CREATED,
      message: message ? message : ResponseMessage.SUCCESS,
    };
  };

  protected OKResponse = (data: any, message?: string) => {
    return {
      data: data,
      code: HttpStatus.OK,
      message: message ? message : ResponseMessage.SUCCESS,
    };
  };

  protected UpdatedResponse = (data: any, message?: string) => {
    return {
      data: data,
      code: HttpStatus.OK,
      message: message ? message : ResponseMessage.SUCCESS,
    };
  };

  protected DeletedResponse = (message?: string) => {
    return {
      data: {},
      code: HttpStatus.OK,
      message: message ? message : ResponseMessage.SUCCESS,
    };
  };
}
