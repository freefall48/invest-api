import {Injectable, ProviderScope} from "@graphql-modules/di";
import {DatabaseProvider} from "@modules/database/database.provider";
import {UserEntity} from "@modules/users/user.model";
import SQL from "sql-template-strings";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Injectable({
    scope: ProviderScope.Session
})
export class AuthenticationProvider {

    constructor(
        private databaseProvider: DatabaseProvider
    ) {}

    async authenticateUser(email: String, password: String) {
        const {rows} = await this.databaseProvider.query<UserEntity>(
            SQL`SELECT * FROM users.users WHERE email = ${email}`
        );
        const user = rows[0];
        /* Check if we found a user with the given email address */
        if (!user) {
            return {
                __typename: "InputInvalidError",
                message: `Email / Password incorrect.`
            }
        }
        /* There is a user with that email so check the password */
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            /* The password did not match */
            return {
                __typename: "InputInvalidError",
                message: "Email / Password incorrect."
            }
        }
        /* The password matched */
        const token = await jwt.sign({id: user.id}, process.env.JWT_KEY);
        return {
            __typename: "Authentication",
            token: token
        }
    }
}