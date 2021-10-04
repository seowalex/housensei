import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { FlatType, Town } from '../utils/model';

@Entity()
export default class TuteeListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: Town })
  location: Town;

  @Column('text')
  name: string;

  @Column('date')
  launchDate: Date;

  @Column('enum', { enum: FlatType })
  flatType: FlatType;

  @Column('int')
  minFloorArea: number; // sqm

  @Column('int')
  maxFloorArea: number; // sqm

  @Column('int')
  minInternalFloorArea: number; // sqm

  @Column('int')
  maxInternalFloorArea: number; // sqm

  @Column('int')
  units: number; // sqm

  // ignore indicative price range cos its transposed. assume transpose has everything needed
  @Column('int')
  minPrice: number;

  @Column('int')
  maxPrice: number;
}
