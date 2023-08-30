import { Exclude } from 'class-transformer';
import {
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class DefaultEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Exclude()
  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamptz',
    name: 'created_at',
    select: false,
  })
  created_at: Date;

  @Exclude()
  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamptz',
    name: 'updated_at',
    select: false,
  })
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_at',
    select: false,
  })
  deleted_at: Date;

  @Exclude()
  @Column({
    select: false,
    nullable: true,
  })
  created_by: number;

  @Exclude()
  @Column({
    select: false,
    nullable: true,
  })
  updated_by: number;
}
