export default async (ctx: any, next: Function) => {
  const { model } = ctx.request.body;
  if (!model.includes("login") && !ctx.session.openid) return (ctx.body = {});
  return await next();
};
