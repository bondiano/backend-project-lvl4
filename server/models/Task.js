// @ts-check

import BaseModel from './BaseModel';

export default class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer', minimum: 1 },
        executorId: { type: ['integer', 'null'] },
        description: { type: 'string' },
      },
    };
  }

  static relationMappings = {
    creator: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'tasks.creatorId',
        to: 'users.id',
      },
    },
    executor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'tasks.executorId',
        to: 'users.id',
      },
    },
    status: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'TaskStatus',
      join: {
        from: 'tasks.statusId',
        to: 'statuses.id',
      },
    },
    labels: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Label',
      join: {
        from: 'tasks.id',
        through: {
          from: 'tasks_labels.taskId',
          to: 'tasks_labels.labelId',
        },
        to: 'labels.id',
      },
    },
  }

  static modifiers = {
    sortByLatestCreatedDate(query) {
      query.orderBy('created_at', 'desc');
    },

    filterByStatus(query, statusId) {
      query.where({ statusId });
    },

    filterByExecutor(query, executorId) {
      query.where({ executorId });
    },

    filterByLabel(query, labelId) {
      query.where({ labelId });
    },

    filterByCreator(query, creatorId) {
      query.where({ creatorId });
    },
  }
}
