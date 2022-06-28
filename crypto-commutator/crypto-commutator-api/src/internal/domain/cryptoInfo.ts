import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CryptoInfo {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column()
      name: string;

    @Column()
      rank: number;

    @Column('double')
      cmValue: number;

    @Column('double')
      cbValue: number;

    @Column('double')
      csValue: number;

    @Column('double')
      kcValue: number;

    @Column('double')
      cpValue: number;

    @Column('bigint')
      time: number;

    constructor(
      name: string,
      rank: number,
      cmValue: number,
      cbValue: number,
      csValue: number,
      kcValue: number,
      cpValue: number,
      time: number,
    ) {
      this.name = name;
      this.rank = rank;
      this.cmValue = cmValue;
      this.cbValue = cbValue;
      this.csValue = csValue;
      this.kcValue = kcValue;
      this.cpValue = cpValue;
      this.time = time;
    }
}
