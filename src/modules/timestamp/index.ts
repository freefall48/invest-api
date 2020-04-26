import {GraphQLModule} from "@graphql-modules/core";
import {GraphQLDate, GraphQLTime, GraphQLDateTime} from 'graphql-iso-date';
import * as typeDefs from "./schema.graphql";

export const TimestampModule = new GraphQLModule({
    typeDefs,
    resolvers: {
        DateTime: GraphQLDateTime,
        Time: GraphQLTime,
        Date: GraphQLDate
    }
})