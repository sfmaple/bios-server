import { Context } from "koa";

export type TPaths = {
  src: string;
  middleware?: string;
  router?: string;
  service?: string;
};
export type TRoute = {
  name: string;
  method: string;
  middleware?: string[];
  models?: { [modelName: string]: string[] };
};
export type TConfig = {
  middleware?: string[];
  routes?: TRoute[];
};
export type TResources = {
  middleware?: any;
  router?: any;
  service?: any;
};

export type TOption = {
  paths: TPaths;
  config: TConfig;
  resources?: TResources;
};

export type TContext = Context & { request: { body: any } };
export enum EModelType {
  service = "service",
  relation = "relation",
  custom = "custom"
}
export type TWorkflow = {
  type: EModelType;
  memory: string;
  params: string[];
  // type: service
  service: string;
  // type: relation
  relationName?: string;
  relationParam?: string;
  relationServiceMap?: { [key: string]: string };
  // type: custom
  handler?: Function;
};
export type TModelConfig = {
  returnKey: string;
  workflow: TWorkflow[];
};
export type TResData = { code: number; message: string; data: any };
