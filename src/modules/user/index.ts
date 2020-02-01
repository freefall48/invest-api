import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './schema.graphql';
import resolvers from './resolvers';

export const UserModule = new GraphQLModule({
  typeDefs,
  resolvers,
});
