import { IsDate, IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsBiggerThanOrEqualTo } from '../validations/common';
import { FlatType, Town } from '../utils/model';

@Entity()
export default class BTO {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(Town)
  @Column('enum', { enum: Town })
  town: Town;

  @IsNotEmpty()
  @Column('text')
  name: string;

  @IsOptional()
  @IsDate()
  @Column('date', { nullable: true })
  launchDate: Date;

  @IsEnum(FlatType)
  @Column('enum', { enum: FlatType })
  flatType: FlatType;

  @IsOptional()
  @Min(0)
  @Column('int', { nullable: true })
  minFloorArea: number; // sqm

  @IsOptional()
  @IsBiggerThanOrEqualTo('minFloorArea')
  @Column('int', { nullable: true })
  maxFloorArea: number; // sqm

  @IsOptional()
  @Min(0)
  @Column('int', { nullable: true })
  minInternalFloorArea: number; // sqm

  @IsOptional()
  @IsBiggerThanOrEqualTo('minInternalFloorArea')
  @Column('int', { nullable: true })
  maxInternalFloorArea: number; // sqm

  @IsOptional()
  @Min(0)
  @Column('int', { nullable: true })
  units: number; // sqm

  @Min(0)
  @Column('int')
  minPrice: number;

  @IsBiggerThanOrEqualTo('minPrice')
  @Column('int')
  maxPrice: number;
}
