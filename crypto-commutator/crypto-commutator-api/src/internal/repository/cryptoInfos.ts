import { Between, DataSource, Repository } from 'typeorm';
import { CryptoInfos } from './repository';
import CryptoInfo from '../domain/cryptoInfo';

class CryptoInfosRepo implements CryptoInfos {
  repo: Repository<CryptoInfo>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(CryptoInfo);
  }

  async findRecentInfos(): Promise<CryptoInfo[]> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        time: Between(timestamp - (300 * 1000), timestamp),
      },
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async findRecentPricesByName(name: string): Promise<CryptoInfo[]> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        name,
        time: Between(timestamp - 300 * 1000, timestamp)
        || Between(timestamp - 35 * 60 * 1000, timestamp - 30 * 60 * 1000)
        || Between(timestamp - 65 * 60 * 1000, timestamp - 60 * 60 * 1000)
        || Between(timestamp - 3 * 60 * 60 * 1000 + 300 * 1000, timestamp - 3 * 60 * 60 * 1000)
        || Between(timestamp - 6 * 60 * 60 * 1000 + 300 * 1000, timestamp - 6 * 60 * 60 * 1000)
        || Between(timestamp - 12 * 60 * 60 * 1000 + 300 * 1000, timestamp - 12 * 60 * 60 * 1000)
        || Between(timestamp - 24 * 60 * 60 * 1000 + 300 * 1000, timestamp - 24 * 60 * 60 * 1000),
      },
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async saveInfos(infos: CryptoInfo[]): Promise<void> {
    await this.repo.save(infos);
  }
}

export default CryptoInfosRepo;
