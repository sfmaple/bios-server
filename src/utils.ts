import Path from 'path';
import glob from 'glob';
import get from 'lodash.get';
import { TResData, TContext } from './typings';

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
export const errorMiddleware = (errorCallback?: Function) => async (ctx: TContext, next: Function) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    errorCallback && errorCallback(error, ctx);
  }
};
export const buildRelationHandler = ({ rest, config, memory, resources }) => async (current: any, ctx: any) => {
  const { relation = {} } = rest;
  const { relationName, relationParam, relationServiceMap } = config;
  let data = get(memory, `${relationParam}.data`);
  if (!relationParam || !data) throw new Error('the relation of model config is unknown.');
  const isArray = Array.isArray(data);
  isArray || (data = [data]);
  const names = Object.keys(relation);
  if (names.some((name) => !relationServiceMap[name])) {
    throw new Error(`the ${name} relation of model config is not support.`);
  }
  const allPromise: any[] = [];
  for (const name of names) {
    const relationParams = relation[name];
    const service = relationServiceMap[name];
    const handler = resources.service[service];
    if (!handler) throw new Error('the model service handler is unknown.');
    const relationIdKey = `${relationName}_id`;
    const params = { ...current.params };
    Object.assign(params, relationParams);
    const promises = data.map((relation: any) => {
      relation[relationIdKey] = relation.id;
      return handler({ ...current, params, relation }, ctx)
        .then((resData: TResData) => {
          delete relation[relationIdKey];
          if (!resData || resData.code !== 0) return;
          resData.data != null && (relation[name] = resData.data);
        })
        .catch((error: Error) => console.error(error));
    });
    allPromise.push(...promises);
  }
  await Promise.all(allPromise);
  isArray || (data = data[0]);
  return { data, code: 0, message: '' };
};
