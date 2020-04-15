import { Pool, PoolClient, QueryResultBase, QueryResult } from 'pg';
import { Injectable, ProviderScope } from '@graphql-modules/di';
import { OnRequest, OnResponse } from '@graphql-modules/core';
import { SQLStatement } from 'sql-template-strings';
import DataLoader from 'dataloader';

@Injectable({
    scope: ProviderScope.Session
})
export class DatabaseProvider implements OnRequest, OnResponse {
    private _poolClient: PoolClient;
    constructor(private pool: Pool) {}
    public async onRequest() {
        this._poolClient = await this.pool.connect();
    }
    public onResponse() {
        if (this._poolClient) {
            this._poolClient.release();
        }
    }
    private queryDataLoader = new DataLoader<SQLStatement, QueryResult>(
        queryStatementList => Promise.all(queryStatementList.map(queryStatement => this._poolClient.query(queryStatement))),
        {
            // Create a cache key using query text together with its values
            cacheKeyFn: (queryStatement) => (queryStatement.text + queryStatement.values.join(',')) as unknown as SQLStatement
        }
    );
    // Use this method to query to the database instead of client's native one.
    public async query<Entity = any>(queryStatement: SQLStatement): Promise<QueryResultBase & { rows: Entity[] }> {
        // If query is `SELECT`-type query, use DataLoader
        if (queryStatement.text.startsWith('SELECT')) {
            return this.queryDataLoader.load(queryStatement);
        } else {
            // Otherwise it is probably mutation query, so do not use dataloader
            return this._poolClient.query(queryStatement);
        }
    }
}