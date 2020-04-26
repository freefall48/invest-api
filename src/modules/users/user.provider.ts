import {Injectable, ProviderScope} from '@graphql-modules/di';
import {DatabaseProvider} from "@modules/database/database.provider";
import {ModuleSessionInfo} from "@graphql-modules/core";
import SQL from "sql-template-strings";
import {UserEntity} from "@modules/users/user.model";
import { AuthenticationError, ApolloError } from 'apollo-server';
import jwt from "jsonwebtoken";

@Injectable({
  scope: ProviderScope.Session
})
export class UserProvider {
  private readonly currentUserId: string;

  constructor(
    private databaseProvider: DatabaseProvider,
    private moduleSessionInfo: ModuleSessionInfo
  ) {
    if (this.moduleSessionInfo.session.req.headers.authorization) {
      const token = this.moduleSessionInfo.session.req.headers.authorization.split(" ");
      if (token[1]) {
        try {
          const decoded = jwt.verify(token[1], process.env.JWT_KEY);
          this.currentUserId = decoded.id;
        } catch {
          this.currentUserId = null;
        }
      }
    }
  }

  async getCurrentUser() {
    if (this.currentUserId == null) {
      throw new AuthenticationError("Current session has no valid user id");
    }
    const {rows} = await this.databaseProvider.query<UserEntity>(
      SQL`SELECT * FROM users.users WHERE id = ${this.currentUserId}`
    );
    if (rows[0]) {
      return {
        __typename: "User",
        ...rows[0]
      };
    } else {
      return {
        __typename: "UserNotFoundError",
        message: "No user was found or no id was provided"
      }
    }
  }
}