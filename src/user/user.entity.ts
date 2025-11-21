import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne,CreateDateColumn,UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', default: 0 })
  vang: number;

  @Column({ type: 'bigint', default: 0 })
  sucManh: number;

  @Column({type: 'bigint', nullable: true })
  auth_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
