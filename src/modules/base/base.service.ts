/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DefaultEntity } from './entities/base.entity';
import { Request } from 'express';
import { MESSAGES } from 'src/common/messages';
import { IRedisUserModel } from '../base/base.interface';

const {
  GLOBAL: {
    ERROR: { DOES_NOT_EXIST },
  },
} = MESSAGES;

@Injectable()
export class BaseService<T, C, U, R> {
  constructor(private repository: Repository<DefaultEntity>) {}

  async Create(body: C, req?: Request): Promise<any> {
    try {
      const resp = await this.repository.save({
        ...body,
      });
      return resp;
    } catch (error) {
      if (
        error.hasOwnProperty('constraint') &&
        error.constraint.startsWith('FK')
      ) {
        const splitted = error.detail.split(' ');
        const table_name = splitted[7].slice(1, -3);
        throw new NotFoundException(`${table_name} ${DOES_NOT_EXIST}`);
      } else {
        throw error;
      }
    }
  }

  public async Find(relations?: string[], req?: Request): Promise<any> {
    try {
      return this.repository.find({ relations });
    } catch (error) {
      throw error;
    }
  }

  public async FindOne(
    id?: number,
    relations?: string[],
    req?: Request,
  ): Promise<any> {
    try {
      const data = await this.repository.findOne({ where: { id }, relations });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(
    id: number,
    body: any,
    req?: Request,
    current_user?: IRedisUserModel,
  ): Promise<any> {
    try {
      let resp;
      const item = await this.repository.findOneBy({ id });
      if (item) {
        resp = await this.repository.save({
          ...item,
          ...body,
        });
      }
      return resp;
    } catch (error) {
      if (
        error.hasOwnProperty('constraint') &&
        error.constraint.startsWith('FK')
      ) {
        const splitted = error.detail.split(' ');
        const table_name = splitted[7].slice(1, -3);
        throw new NotFoundException(`${table_name} ${DOES_NOT_EXIST}`);
      } else {
        throw error;
      }
    }
  }

  public async Delete(
    id: number,
    relations?: string[],
    req?: Request,
  ): Promise<any> {
    try {
      const item = await this.FindOne(id, relations);
      await this.repository.softRemove(item);
      return null;
    } catch (error) {
      throw error;
    }
  }
}
