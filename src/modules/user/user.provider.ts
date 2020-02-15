import 'reflect-metadata';
import { Injectable } from '@graphql-modules/di';

@Injectable()
export class UserProvider {
  users = [
    {
      _id: '10',
      username: 'jhon',
    },
    {
      _id: '2',
      username: 'sarah',
    },
    {
      _id: '1',
      username: 'Matt is awesome2!',
    },
  ];
  getUserById(id: string): { _id: string; username: string } {
    return this.users.find(user => user._id === id);
  }
}
