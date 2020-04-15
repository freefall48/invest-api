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
        const match = await bcrypt.compare(password, user.passwdHash);
        if (!match) {
            /* The password did not match */
            return {
                __typename: "InputInvalidError",
                message: "Email / Password incorrect."
            }
        }
        /* The password matched */
        const token = await jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: '10m'});
        const rt = await jwt.sign({id: user.id}, process.env.RT_KEY, {expiresIn: '30d', algorithm: "HS384"});
        return {
            __typename: "Authentication",
            token: token,
            rt: rt
        }
    }

    async refreshToken(rt: String) {
        try {
            const decoded = jwt.verify(rt, process.env.RT_KEY, {algorithm: "HS384"});
            const token = await jwt.sign({id: decoded.id}, process.env.JWT_KEY, {expiresIn: '10m'});
            return {
                __typename: "Authentication",
                token: token,
                rt: rt
            }
        }catch (err) {
            return {
                __typename: "InputInvalidError",
                message: "Invalid refresh token provided."
            }
        }
    }
}