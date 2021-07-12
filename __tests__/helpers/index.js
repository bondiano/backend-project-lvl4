// @ts-check
import fs from 'fs';
import path from 'path';

const getFixturePath = (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
  await knex('statuses').insert(getFixtureData('statuses.json'));
  await knex('tasks').insert(getFixtureData('tasks.json'));
  await knex('labels').insert(getFixtureData('labels.json'));
  await knex('tasks_labels').insert(getFixtureData('tasksLabels.json'));
};

/**
 * @param {Object} app
 * @param {Object} data
 * @returns cookies
 */
export const signIn = async (app, data) => {
  const response = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data,
    },
  });

  const [sessionCookie] = response.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};
