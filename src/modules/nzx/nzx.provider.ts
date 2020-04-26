import {Injectable, ProviderScope} from "@graphql-modules/di";
import {DatabaseProvider} from "@modules/database/database.provider";
import {UserEntity} from "@modules/users/user.model";
import SQL from "sql-template-strings";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {DailyPrice} from "@modules/nzx/nzx.models";

@Injectable({
    scope: ProviderScope.Session
})
export class NzxProvider {

    constructor(
        private databaseProvider: DatabaseProvider
    ) {}

    async getDailyPrice(codes) {
        /* Calculate the current date string for the bucket */
        const today = new Date();
        const date = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDay()}`;
        const  {rows} = await this.databaseProvider.query<DailyPrice>(
            SQL`SELECT * from nzx.price_daily where code in ('NZX') and bucket = ${date}`
        );
        console.log(codes.map(item => "'"+item+"'").join(", "))
        console.log(rows)
        return {
            __typename: "DailyPrices",
            prices: rows
        }
    }
}