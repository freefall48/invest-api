import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { RootModule } from '@modules/app';
import Arena from 'bull-arena';
import expressPlayground from 'graphql-playground-middleware-express';

import { NZXTrackingTask } from '@tasks/nzx';

// Constants
const PORT = process.env.PORT || 4000;
const QUEUE_NAME = 'Indicies';

const app = express();

// Securing the API Server
app.use(helmet());
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: RootModule.schema,
    graphiql: false,
  }),
);

// Graphql playground for development
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

// Bull Arena to view job queue during development
const arenaConfig = Arena(
  {
    queues: [
      {
        name: 'Indicies',
        hostId: 'Invest API',
        redis: {
          port: 6379,
          host: 'localhost',
        },
      },
    ],
  },
  {
    basePath: '/arena',
    disableListen: true,
  },
);

app.use('/', arenaConfig);

// Bind to the port and start the express server
app.listen(PORT, () => {
  console.log(`API Server now avaiable on port: http://localhost:${PORT}`);
});

// Register the worker and task used to update the current NZX prices every 20 minutes
const indiciesPriceTask = new NZXTrackingTask(QUEUE_NAME);
indiciesPriceTask
  .RegisterProcess()
  .then(() => {
    console.log('Registered NZX tracking workers.');
  })
  .then(() => indiciesPriceTask.RegisterTask().then(() => console.log('Loaded NZX tracking tasks into REDIS.')));
