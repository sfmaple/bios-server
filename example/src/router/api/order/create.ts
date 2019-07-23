export default {
  returnKey: "create",
  workflow: [
    {
      type: "service",
      memory: "create",
      params: ["params"],
      service: "order.index.saveOrderByUserId"
    }
  ]
};
