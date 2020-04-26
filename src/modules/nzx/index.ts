import {GraphQLModule} from "@graphql-modules/core";
import resolvers from "@modules/nzx/resolvers";
import * as typeDefs from "./schema.graphql";
import {NzxProvider} from "@modules/nzx/nzx.provider";
import {DatabaseModule} from "@modules/database";
import {TimestampModule} from "@modules/timestamp";


export const NzxModule = new GraphQLModule({
    typeDefs,
    resolvers,
    providers: [NzxProvider],
    imports: [DatabaseModule, TimestampModule]
});