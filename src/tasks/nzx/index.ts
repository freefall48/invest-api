import { BaseTask } from '@tasks/task';
import { PriceProcessor, ListingProcessor } from './processor';

export class NZXTrackingTask extends BaseTask {
  async RegisterTask(): Promise<void> {
    // Attempt to register the job. Bull will prevent adding a
    // duplicate job. We only want to track during open hours
    await this.queue.add('indiciesPricesFull', {}, { repeat: { cron: '*/20 10-17 * * 1-5' } });

    // whenever started create a job that will check for any changes to listings
    await this.queue.add('indexListings', {}, { delay: 10000 });
  }
  RegisterProcess(): Promise<void> {
    return new Promise(resolve => {
      // Processor for the indicies price change tracking
      this.queue.process('indiciesPricesFull', PriceProcessor);

      // Processor for updating known listings
      this.queue.process('indexListings', ListingProcessor);
      resolve();
    });
  }
}
