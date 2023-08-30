import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions) {
    super(options);
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected validate(
    object: object,
    validatorOptions?: ValidatorOptions,
  ): ValidationError[] | Promise<ValidationError[]> {
    if (object === undefined || Object.keys(object).length === 0) {
      throw new BadRequestException('Provide a valid JSON body');
    }
    return super.validate(object, validatorOptions);
  }
}

const flatten_errors = (errors: ValidationError[], parent?: string) => {
  console.log(errors);
  if (errors.length === 0) {
    return [];
  }
  let output = [];
  for (const e of errors) {
    const error_key = parent ? `${parent}.${e.property}` : e.property;
    if (e.constraints) {
      output.push({ [error_key]: Object.values(e.constraints).join(',') });
    }
    const child_errors = flatten_errors(e.children, e.property);
    output = [...output, ...child_errors];
  }
  return output;
};

type TransformErrors = (errors: ValidationError[]) => Record<string, string>;
const transform_errors: TransformErrors = (errors) => {
  return flatten_errors(errors).reduce((acc, e) => ({ ...e, ...acc }), {});
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: transform_errors(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

export default validationOptions;
