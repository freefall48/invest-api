import { Pool } from "pg";
import {GraphQLModule} from "@graphql-modules/core";
import {DatabaseProvider} from "@modules/database/database.provider";

export const DatabaseModule = new GraphQLModule({
    providers: [
        {provide: Pool, useFactory: () => new Pool({
                host: process.env.PGHOST,
                user: process.env.PGUSER,
                password: process.env.PGPASSWORD,
                max: 20,
                connectionTimeoutMillis: 2000,
                database: process.env.PGDATABASE
            })},
        DatabaseProvider
    ]
})