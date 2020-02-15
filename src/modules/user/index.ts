import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './schema.graphql';
import resolvers from './resolvers';
import { UserProvider } from './user.provider';

export const UserModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [UserProvider],
});
