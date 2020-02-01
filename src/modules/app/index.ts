import { GraphQLModule } from '@graphql-modules/core';
import { UserModule } from '@modules/user';

export const RootModule = new GraphQLModule({
  imports: [UserModule],
});
