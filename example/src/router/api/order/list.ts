export default {
  returnKey: "list",
  workflow: [
    {
      type: "service",
      memory: "list",
      params: ["params"],
      service: "order.index.queryOrderByOpenid",
      // relation中使用：将id转换成${name}_id
      name: "order",
      relations: {
        goods: "goods.index.queryGoodsByOrderId"
      }
    }
  ]
};
