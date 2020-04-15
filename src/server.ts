import "graphql-import-node";
import "reflect-metadata";

import express from "express";
import expressPlayground from 'graphql-playground-middleware-express';
import helmet from "helmet";
import cors from "cors";
import graphqlHTTP from "express-graphql";
import {RootModule} from "@modules/app";

/* Constants */
const PORT = process.env.INVEST_API_PORT || 4000;

/* Create the server used to serve graphql */
const app = express();
app.use(helmet());
app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP((req, res ) => ({
        schema: RootModule.schema,
        graphiql: false,
        context: { session : { req, res } }
    }))
);

/* IDE used to test the graphql queries during development */
app.get('/playground', expressPlayground({endpoint: "/graphql"}));

/* Start listing on the server */
app.listen(PORT, () => {
    console.log(`API Server now available at: http://localhost:${PORT}/graphql`);
    console.log(`Graphql IDE now available at: http://localhost:${PORT}/playground`)
})