import { GraphQLModule } from "@graphql-modules/core";
import { DatabaseModule } from "@modules/database";
import {UserModule} from "@modules/users";
import {AuthenticationModule} from "@modules/authentication";
import {NzxModule} from "@modules/nzx";
import {TimestampModule} from "@modules/timestamp";

export const RootModule = new GraphQLModule({
    imports: [
        DatabaseModule,
        UserModule,
        AuthenticationModule,
        NzxModule,
        TimestampModule
    ]
});