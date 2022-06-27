import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CryptoFav {
    @PrimaryGeneratedColumn('uuid')
      id: string;

    @Column()
      idTg: number;

    @Column()
      name: string;

    constructor(idTg: number, name: string) {
      this.idTg = idTg;
      this.name = name;
    }
}
