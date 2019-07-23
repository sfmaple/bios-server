import handleModel from "./model";
import {
  UNKNOWN_METHOD_ERROR,
  UNKNOWN_MODEL_ERROR
} from "../../constants/resData";
import { TRoute, TContext } from "../../typings";

export default async function(route: TRoute, ctx: TContext) {
  let model: any = null;
  let params: any = null;
  let relation: any = null;
  const { router } = this.resources;
  const { name, models = {} } = route;
  const { method, query, body } = ctx.request;
  switch (method) {
    case "GET":
      ({ model, params, relation } = query);
      break;
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
      ({ model, params, relation } = body);
      break;
    case "OPTIONS":
      return (ctx.status = 204);
    default:
      return (ctx.body = UNKNOWN_METHOD_ERROR);
  }
  const key = `${name}.${model}`;
  if (!model || model[key]) return (ctx.body = UNKNOWN_MODEL_ERROR);
  const modelConfig = router[key];
  // TODO: middleware 根据不同的 model 进行自定义加载
  models;
  const memory = { params, relation };
  return (ctx.body = await handleModel.call(this, modelConfig, memory, ctx));
}
