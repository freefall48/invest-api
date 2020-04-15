import {GraphQLModule} from "@graphql-modules/core";
import * as typeDefs from "@modules/users/schema.graphql"
import resolvers from "@modules/users/resolvers";
import {UserProvider} from "@modules/users/user.provider";
import {DatabaseModule} from "@modules/database";



export const UserModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [UserProvider],
    imports: [DatabaseModule]
});