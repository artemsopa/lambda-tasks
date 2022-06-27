import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CryptoInfo {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column()
      name: string;

    @Column('decimal')
      cmValue: number;

    @Column('decimal')
      cbValue: number;

    @Column('decimal')
      csValue: number;

    @Column('decimal')
      kcValue: number;

    @Column('decimal')
      cpValue: number;

    @Column({ type: 'timestamp' })
      createdAt: number;

    constructor(
      name: string,
      cmValue: number,
      cbValue: number,
      csValue: number,
      kcValue: number,
      cpValue: number,
      time: number,
    ) {
      this.name = name;
      this.cmValue = cmValue;
      this.cbValue = cbValue;
      this.csValue = csValue;
      this.kcValue = kcValue;
      this.cpValue = cpValue;
      this.createdAt = time;
    }
}
