export default {
  returnKey: "custom",
  workflow: [
    {
      type: "service",
      memory: "wxLogin",
      params: ["params"],
      service: "wx.index.loginByCode"
    }
  ]
};
