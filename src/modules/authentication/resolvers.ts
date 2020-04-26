import {AuthenticationProvider} from "@modules/authentication/authentication.provider";

export default {
    Mutation: {
        authenticate: (root, {input: {email, password}}, {injector}) =>
            injector.get(AuthenticationProvider).authenticateUser(email, password)
    }
}