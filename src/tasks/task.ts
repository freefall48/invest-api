import Queue from 'bull';

// Define the interface used to register tasks into the main event loop
interface Task {
  queue: Queue.Queue;

  RegisterTask(): Promise<void>;
  RegisterProcess(): Promise<void>;
}

export abstract class BaseTask implements Task {
  queue: Queue.Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName);
  }

  // Dont want to provide an implementation in the base class
  abstract async RegisterTask(): Promise<void>;

  abstract async RegisterProcess(): Promise<void>;
}
