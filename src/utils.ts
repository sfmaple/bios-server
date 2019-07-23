import Path from 'path';
import glob from 'glob';
import get from 'lodash.get';
import { UNKNOWN_SERVICE_ERROR, UNKNOWN_RELATION_ERROR, NO_SUPPORT_RELATION_ERROR } from './constants/resData';
import { TResData } from './typings';

export const exportResource = (path: string = '') => {
  if (!path) throw new Error('the path param cannot be empty string.');
  const filenames: string[] = glob.sync('**/*', { cwd: path }).filter((filename) => /.[jt]s$/.test(filename));
  const resources = filenames.reduce((prev, filename: string) => {
    const nameKey = filename.slice(0, -3).replace(/\//g, '.');
    const modulePath = Path.join(path, `/${filename}`);
    const module: any = require(modulePath);
    prev[nameKey] = module.default || module;
    return prev;
  }, {});
  return resources;
};
export const buildRelationHandler = ({ rest, config, memory, resources }) => async (current: any, ctx: any) => {
  const { relation } = rest;
  const { relationName, relationParam, relationServiceMap } = config;
  let data = get(memory, `${relationParam}.data`);
  if (!relationParam || !data) return UNKNOWN_RELATION_ERROR;
  const isArray = Array.isArray(data);
  isArray || (data = [data]);
  const names = Object.keys(relation);
  if (names.some((name) => !relationServiceMap[name])) {
    return NO_SUPPORT_RELATION_ERROR;
  }
  const allPromise: any[] = [];
  for (const name of names) {
    const relationParams = relation[name];
    const service = relationServiceMap[name];
    const handler = resources.service[service];
    if (!handler) return UNKNOWN_SERVICE_ERROR;
    const relationIdKey = `${relationName}_id`;
    const params = { ...current.params };
    Object.assign(params, relationParams);
    const promises = data.map((relation: any) => {
      relation[relationIdKey] = relation.id;
      return handler({ ...current, params, relation }, ctx)
        .then((resData: TResData) => {
          delete relation[relationIdKey];
          if (!resData || resData.code !== 0) return;
          resData.data && (relation[name] = resData.data);
        })
        .catch(() => {});
    });
    allPromise.push(promises);
  }
  await Promise.all(allPromise);
  isArray || (data = data[0]);
  return { data, code: 0, message: '' };
};
