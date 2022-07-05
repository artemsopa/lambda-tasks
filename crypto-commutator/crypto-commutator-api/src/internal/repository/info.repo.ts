import { Between, DataSource, In, Repository } from 'typeorm';
import { IInfosRepo } from './repository';
import Info from '../entities/info';

const MIN_5 = 5 * 60 * 1000;
const MIN_30 = 30 * 60 * 1000;
const HOUR_1 = 60 * 60 * 1000;

class InfosRepo implements IInfosRepo {
  repo: Repository<Info>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Info);
  }

  async findRecent(): Promise<Info[]> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        time: Between(timestamp - MIN_5, timestamp),
      },
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async findAllByNames(names: string[]): Promise<Info[]> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        name: In(names),
        time: Between(timestamp - MIN_5, timestamp),
      },
      order: {
        rank: 'ASC',
      },
    });
    console.log(infos);
    return infos;
  }

  async findOneByName(name: string): Promise<Info[]> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where:
      [
        { name, time: Between(timestamp - MIN_5, timestamp) },
        { name, time: Between(timestamp - MIN_30 - MIN_5, timestamp - MIN_30) },
        { name, time: Between(timestamp - HOUR_1 - MIN_5, timestamp - HOUR_1) },
        { name, time: Between(timestamp - 3 * HOUR_1 - MIN_5, timestamp - 3 * HOUR_1) },
        { name, time: Between(timestamp - 6 * HOUR_1 - MIN_5, timestamp - 6 * HOUR_1) },
        { name, time: Between(timestamp - 12 * HOUR_1 - MIN_5, timestamp - 12 * HOUR_1) },
        { name, time: Between(timestamp - 24 * HOUR_1 - MIN_5, timestamp - 24 * HOUR_1) },
      ],
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async save(infos: Info[]): Promise<void> {
    await this.repo.save(infos);
  }
}

export default InfosRepo;
