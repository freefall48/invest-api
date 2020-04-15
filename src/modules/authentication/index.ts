import {GraphQLModule} from "@graphql-modules/core";
import * as typeDefs from "@modules/authentication/schema.graphql"
import resolvers from "@modules/authentication/resolvers";
import {AuthenticationProvider} from "@modules/authentication/authentication.provider";
import {DatabaseModule} from "@modules/database";



export const AuthenticationModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [AuthenticationProvider],
    imports: [DatabaseModule]
});