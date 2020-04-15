import {UserProvider} from "@modules/users/user.provider";

export default {
    Query: {
        currentUser: (root, {id}, {injector}) => injector.get(UserProvider).getCurrentUser()
    },
    // User: {
    //     id: user => user.id,
    //     firstName: user => user.firstName,
    //     lastName: user => user.lastName,
    //     email: user => user.email
    // }
};