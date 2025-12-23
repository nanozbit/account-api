
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('info')
export class Info {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  message: string;
}