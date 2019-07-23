import Path from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import handler from './handler';
import { exportResource, errorMiddleware } from '../utils';
import { TPaths, TConfig, TResources, TOption, TContext } from '../typings';

export default class BiosServer extends Koa {
  paths: TPaths;
  config: TConfig;
  resources: TResources;
  errorCallback?: Function;
  constructor(option: TOption) {
    super();
    const { paths, config, resources, errorCallback } = option;
    this.paths = paths || {};
    this.config = config;
    this.resources = resources || {};
    this.errorCallback = errorCallback;
    this.initial();
    this.parser();
  }
  private initial() {
    const { src, middleware, router, service } = this.paths;
    if (!src) throw new Error('the option.paths.src cannot be empty string.');
    middleware || (this.paths.middleware = Path.join(src, './middleware'));
    router || (this.paths.router = Path.join(src, './router'));
    service || (this.paths.service = Path.join(src, './service'));
  }
  private parser() {
    const { middleware, router, service } = this.paths;
    const middleResources = exportResource(middleware);
    const routerResources = exportResource(router);
    let serviceResources = exportResource(service);
    serviceResources = Object.keys(serviceResources).reduce((prev, parentKey) => {
      const services = serviceResources[parentKey];
      Object.keys(services).forEach((key) => {
        const value = services[key];
        const name = `${parentKey}.${key}`;
        prev[name] = value;
      });
      return prev;
    }, {});
    this.resources.middleware = Object.assign(this.resources.middleware || {}, middleResources);
    this.resources.router = Object.assign(this.resources.router || {}, routerResources);
    this.resources.service = Object.assign(this.resources.service || {}, serviceResources);
  }
  private register() {
    const { middleware = [], routes = [] } = this.config;
    middleware.forEach((name: string) => {
      const fn = this.resources.middleware[name];
      if (typeof fn !== 'function') return;
      this.use(fn.bind(this));
    });
    const router = new Router();
    routes.forEach((route) => {
      const { name, method = 'all', middleware = [] } = route;
      if (!name || !router[method]) return;
      const mids = middleware.reduce(
        (prev: Function[], name: string) => {
          const fn = this.resources.middleware[name];
          typeof fn !== 'function' && prev.push(fn);
          return prev;
        },
        [errorMiddleware(this.errorCallback)]
      );
      router[method](`/${name}`, ...mids, async (ctx: TContext) => {
        await handler.call(this, route, ctx);
      });
    });
    this.use(router.routes()).use(router.allowedMethods());
  }
  public run(...args: any[]) {
    this.use(bodyParser());
    this.register();
    // @ts-ignore
    this.listen.call(this, ...args);
  }
}
