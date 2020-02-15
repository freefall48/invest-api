import 'reflect-metadata';
import { Injectable } from '@graphql-modules/di';

@Injectable()
export class IndiciesProvider {
  users = [
    {
      _id: '10',
      username: 'jhon',
    },
  ];
  getUserById(id: string): { _id: string; username: string } {
    return this.users.find(user => user._id === id);
  }
}
