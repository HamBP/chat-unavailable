import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  id!: number; // auto increment id

  @CreateDateColumn()
  createdAt: Date; // auto log 생성일

  @UpdateDateColumn()
  updatedAt: Date; // auto log 업데이트 일자

  @DeleteDateColumn()
  deletedAt?: Date; // auto log soft삭제

  @VersionColumn()
  v: number; // auto log 업데이트 - 횟수
}
