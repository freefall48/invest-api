import {Injectable, ProviderScope} from '@graphql-modules/di';
import {DatabaseProvider} from "@modules/database/database.provider";
import {ModuleSessionInfo} from "@graphql-modules/core";
import SQL from "sql-template-strings";
import {UserEntity} from "@modules/users/user.model";


@Injectable({
    scope: ProviderScope.Session
})
export class UserProvider {
    private readonly currentUserId: string;

    constructor(
        private databaseProvider: DatabaseProvider,
        private moduleSessionInfo: ModuleSessionInfo
    ) {
        const token = this.moduleSessionInfo.session.req.headers.authorization;
        if (token) {
            this.currentUserId = "1";
        }
    }

    async getCurrentUser() {
        const {rows} = await this.databaseProvider.query<UserEntity>(
            SQL`SELECT * FROM users.users WHERE id = ${this.currentUserId}`
        );
        if (rows[0]) {
            return {
                __typename: "User",
                ...rows[0]
            };
        }
        return {
            __typename: "UserNotFoundError",
            message: "There is no current user associated with this session."
        }
    }

    // async createNewUser(name: string, email: string, ...someOtherThings) {
    //     try {
    //         await this.databaseProvider.query(SQL`BEGIN`);
    //
    //
    //         // Other processes in a single transaction that uses the same client for all sessions
    //
    //         await this.databaseProvider.query(SQL`COMMIT`);
    //     } catch (e) {
    //         await this.databaseProvider.query(SQL`ROLLBACK`);
    //         throw e;
    //     }
    // }
}