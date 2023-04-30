import { HttpException, HttpStatus } from '@nestjs/common';
import { BUSINESS_ERROR_CODE } from './business.error.codes';

type BusinessError = {
  code: number;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: BUSINESS_ERROR_CODE.COMMON,
        message: err,
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwForbidden() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.ACCES_FORBIDDEN,
      message: '抱歉没权限，想看得花钱！',
    });
  }
}
