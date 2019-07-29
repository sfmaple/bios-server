import get from 'lodash.get';
import set from 'lodash.set';
import { buildRelationHandler } from '../../utils';
import { TModelConfig, TResData, TContext } from '../../typings';

export default async function(modelConfig: TModelConfig, rest: any, ctx: TContext) {
  const { resources } = this;
  const { returnKey, workflow = [] } = modelConfig;
  if (!returnKey) throw new Error(`the returnKey of model config is empty.`);
  const memory = { params: { data: rest.params } };
  for (const obj of workflow) {
    const { isThrow, type, memory: memoryKey, params = ['params'] } = obj;
    const current = params.reduce((prev, param) => {
      const value = get(memory, `${param}.data`);
      set(prev, param, value);
      return prev;
    }, {});
    let handler: any = null;
    switch (type) {
      case 'custom': {
        handler = obj.handler;
        break;
      }
      case 'service': {
        const { service } = obj;
        handler = resources.service[service];
        break;
      }
      case 'relation': {
        handler = buildRelationHandler({ rest, memory, resources, config: obj });
        break;
      }
    }
    if (!handler) throw new Error('the model service handler is unknown.');
    const resData: TResData = await handler(current, ctx);
    if (!isThrow && resData && resData.code !== 0) return resData;
    resData && memoryKey && (memory[memoryKey] = resData);
  }
  const resData = memory[returnKey];
  if (resData) return resData;
  throw new Error(`the returnKey of model config is empty.`);
}
