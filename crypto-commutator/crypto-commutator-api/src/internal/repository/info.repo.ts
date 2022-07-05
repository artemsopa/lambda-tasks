import { Between, DataSource, In, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { IInfosRepo } from './repository';
import Info from '../entities/info';

class InfosRepo implements IInfosRepo {
  repo: Repository<Info>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Info);
  }

  async findRecent(): Promise<Info[]> {
    const timestamp = DateTime.now();
    const infos = await this.repo.find({
      where: {
        time: Between(timestamp.minus({ minutes: 5 }).toMillis(), timestamp.toMillis()),
      },
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async findAllByNames(names: string[]): Promise<Info[]> {
    const timestamp = DateTime.now();
    const infos = await this.repo.find({
      where: {
        name: In(names),
        time: Between(timestamp.minus({ minutes: 5 }).toMillis(), timestamp.toMillis()),
      },
      order: {
        rank: 'ASC',
      },
    });
    return infos;
  }

  async findOneByName(name: string): Promise<Info[]> {
    const timestamp = DateTime.now();
    const infos = await this.repo.find({
      where:
      [
        { name,
          time: Between(
            timestamp.minus({ minutes: 5 }).toMillis(),
            timestamp.toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ minutes: 35 }).toMillis(),
            timestamp.minus({ minutes: 30 }).toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ hours: 1, minutes: 5 }).toMillis(),
            timestamp.minus({ hours: 1 }).toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ hours: 3, minutes: 5 }).toMillis(),
            timestamp.minus({ hours: 3 }).toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ hours: 6, minutes: 5 }).toMillis(),
            timestamp.minus({ hours: 6 }).toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ hours: 12, minutes: 5 }).toMillis(),
            timestamp.minus({ hours: 12 }).toMillis(),
          ),
        },
        { name,
          time: Between(
            timestamp.minus({ hours: 24, minutes: 5 }).toMillis(),
            timestamp.minus({ hours: 24 }).toMillis(),
          ),
        },
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
