import { UserProvider } from './user.provider';

export default {
  Query: {
    user: (root, { id }, { injector }): Function => {
      return injector.get(UserProvider).getUserById(id);
    },
  },
  User: {
    id: (user: { _id: string }): string => user._id,
    username: (user: { username: string }): string => user.username,
  },
};
