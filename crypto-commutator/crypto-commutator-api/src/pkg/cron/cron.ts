import cron from 'node-cron';
import { Services } from '../../internal/service/service';

const startTask = (services: Services) => {
  const cronJob = cron.schedule('*/5 * * * *', async () => {
    try {
      await services.infos.saveInfos();
      console.log('Success!');
    } catch (error) {
      console.log(error);
    }
  });
  cronJob.start();
};

export default startTask;
