import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Info {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column()
      name: string;

    @Column()
      rank: number;

    @Column('double')
      marketCapValue: number;

    @Column('double')
      coinBaseValue: number;

    @Column('double')
      coinStatsValue: number;

    @Column('double')
      kucoinValue: number;

    @Column('double')
      coinPaprikaValue: number;

    @Column('bigint')
      time: number;

    constructor(
      name: string,
      rank: number,
      marketCapValue: number,
      coinBaseValue: number,
      coinStatsValue: number,
      kucoinValue: number,
      cpValue: number,
      time: number,
    ) {
      this.name = name;
      this.rank = rank;
      this.marketCapValue = marketCapValue;
      this.coinBaseValue = coinBaseValue;
      this.coinStatsValue = coinStatsValue;
      this.kucoinValue = kucoinValue;
      this.coinPaprikaValue = cpValue;
      this.time = time;
    }
}
