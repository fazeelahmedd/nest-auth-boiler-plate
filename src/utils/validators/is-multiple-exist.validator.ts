import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { DataSource, In } from 'typeorm';

@ValidatorConstraint({ name: 'IsMultipleExist', async: true })
@Injectable()
export class IsMultipleExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async validate(values: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0];
    const path_to_property = validationArguments.constraints[1];
    let where_options = validationArguments.constraints[2] ?? {};
    if (typeof where_options === 'function') {
      where_options = await where_options(this.dataSource, {
        repository,
        path_to_property,
      });
    }
    if (typeof where_options !== 'object') {
      throw new InternalServerErrorException(
        'Where options in IsMultipleExists should be object or a function that returns an object',
      );
    }
    if (values === undefined || values === null || !Array.isArray(values)) {
      return false;
    }
    const entity = await this.dataSource.getRepository(repository).find({
      where: { [path_to_property]: In([...values]), ...where_options },
    });

    return Boolean(entity.length === values.length);
  }
}
