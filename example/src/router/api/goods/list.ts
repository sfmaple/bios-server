export default {
  returnKey: "list",
  workflow: [
    {
      type: "service",
      memory: "list",
      params: ["params"],
      service: "goods.index.queryGoodsByShopId"
    }
  ]
};
