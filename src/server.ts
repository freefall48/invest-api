import { GraphQLModule } from '@graphql-modules/core';
import { ApolloServer } from 'apollo-server';
import { RootModule } from '@modules/app';

const { schema, context } = RootModule;

const server = new ApolloServer({
  schema,
  context,
  introspection: true,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
