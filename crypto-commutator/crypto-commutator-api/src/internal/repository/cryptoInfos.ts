import { Between, DataSource, Repository } from 'typeorm';
import { CryptoInfos } from './repository';
import CryptoInfo from '../domain/cryptoInfo';

class CryptoInfosRepo implements CryptoInfos {
  repo: Repository<CryptoInfo>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(CryptoInfo);
  }

  async findRecentInfos(): Promise<CryptoInfo[] | undefined> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        createdAt: Between(timestamp, timestamp + (5 * 60 * 1000)),
      },
    });
    return infos;
  }

  async findInfosByName(name: string): Promise<CryptoInfo[] | undefined> {
    const timestamp = Date.now();
    const infos = await this.repo.find({
      where: {
        name,
        createdAt: Between(timestamp, timestamp + (24 * 65 * 60 * 1000)),
      },
    });
    return infos;
  }

  async saveInfos(infos: CryptoInfo[]): Promise<void> {
    await this.repo.save(infos);
  }
}

export default CryptoInfosRepo;
