// @ts-check
import fs from 'fs';
import path from 'path';

const getFixturePath = (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app) => {
  const { knex } = app.objection;

  // получаем данные из фикстур и заполняем БД
  await knex('users').insert(getFixtureData('users.json'));
};

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
