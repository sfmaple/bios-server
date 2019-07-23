export default {
  returnKey: "save",
  workflow: [
    {
      type: "service",
      memory: "save",
      params: ["params"],
      service: "user.index.saveUserByOpenid"
    }
  ]
};
