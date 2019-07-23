import handleModel from './model';
import { TRoute, TContext } from '../../typings';

export default async function(route: TRoute, ctx: TContext) {
  let model: any = null;
  let params: any = null;
  let relation: any = null;
  const { router } = this.resources;
  const { name, models = {} } = route;
  const { method, query, body } = ctx.request;
  switch (method) {
    case 'GET':
      ({ model, params, relation } = query);
      break;
    case 'POST':
    case 'PUT':
    case 'PATCH':
    case 'DELETE':
      ({ model, params, relation } = body);
      break;
    case 'OPTIONS':
      return (ctx.status = 204);
    default:
      throw new Error('the request method is unknown.');
  }
  const key = `${name}.${model}`;
  if (!model || model[key]) throw new Error('the request model is unknown.');
  const modelConfig = router[key];
  // TODO: middleware 根据不同的 model 进行自定义加载
  models;
  const rest = { params, relation };
  const resData = await handleModel.call(this, modelConfig, rest, ctx);
  return (ctx.body = resData);
}
