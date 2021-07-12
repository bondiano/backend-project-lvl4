import _ from 'lodash';

export default (ids) => [ids].flat().filter((id) => !_.isEmpty(id)).map((id) => Number(id));
