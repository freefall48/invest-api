import "graphql-import-node";
import "reflect-metadata";

import {RootModule} from "@modules/app";
import {ApolloServer} from "apollo-server";

const server = new ApolloServer({
  schema: RootModule.schema,
  context: session => session
})

server.listen({
  host: '0.0.0.0',
  port: 4000
}).then(({url}) => {
  console.log(`API server read on: ${url}`);
})
