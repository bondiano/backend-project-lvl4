// @ts-check

import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';

import BaseModel from './BaseModel.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }

  static get relationMappings() {
    return {
      createdTasks: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Task',
        join: {
          from: 'users.id',
          to: 'tasks.creatorId',
        },
      },
      assignedTasks: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Task',
        join: {
          from: 'users.id',
          to: 'tasks.executorId',
        },
      },
    };
  }
}
