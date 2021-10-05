import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { FlatType, Town } from '../utils/model';

@Entity()
export default class ResaleFlat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  transactionDate: Date; // yyyy-MM

  @Column('enum', { enum: Town })
  location: Town;

  @Column('enum', { enum: FlatType })
  flatType: FlatType;

  @Column('text')
  flatModel: string;

  @Column('int')
  block: number;

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

  @Column('int', { nullable: true })
  remainingLease: number; // months

  @Column('int')
  resalePrice: number;
}
