// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookies = await signIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      cookies,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expectedTask = _.omit(params, 'labels');
    const task = await models.task.query().findOne(expectedTask);
    expect(task).toMatchObject(expectedTask);

    const taskLabels = await task.$relatedQuery('labels');
    const expectedLabels = await models.label.query().findByIds(params.labels);
    expect(_.sortBy(taskLabels, 'id')).toMatchObject(_.sortBy(expectedLabels, 'id'));
  });

  it('update', async () => {
    const { id } = await models.task.query().findOne({
      name: testData.tasks.existing.name,
    });
    const params = testData.tasks.new;

    const responseUpdate = await app.inject({
      method: 'PATCH',
      url: app.reverse('task', { id }),
      cookies,
      payload: {
        data: params,
      },
    });

    expect(responseUpdate.statusCode).toBe(302);
    const updatedTask = await models.task.query().findById(id);
    const data = _.omit(params, 'labels');
    expect(updatedTask).toMatchObject(data);
  });

  it('show', async () => {
    const currentTask = await models.task.query()
      .findOne({ name: testData.tasks.existing.name });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('task', { id: currentTask.id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('delete', async () => {
    const currentTask = await models.task.query()
      .findOne({ name: testData.tasks.existing.name });
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('task', { id: currentTask.id }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findById(currentTask.id);
    expect(task).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
