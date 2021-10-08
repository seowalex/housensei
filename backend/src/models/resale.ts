import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { FlatType, Town } from '../utils/model';

@Entity()
export default class Resale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  transactionDate: Date; // yyyy-MM

  @Column('enum', { enum: Town })
  town: Town;

  @Column('enum', { enum: FlatType })
  flatType: FlatType;

  @Column('text')
  flatModel: string;

  @Column('text')
  block: string;

  @Column('text')
  streetName: string;

  @Column('int')
  floorArea: number; // sqm

  @Column('int')
  minStorey: number;

  @Column('int')
  maxStorey: number;

  @Column('date')
  leaseCommenceYear: Date; // year

  @Column('int')
  resalePrice: number;

  @Column({ type: 'float', array: true, nullable: true })
  coordinates: [number, number];
}
