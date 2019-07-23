export default {
  returnKey: "login",
  workflow: [
    {
      type: "service",
      memory: "login",
      params: ["params"],
      service: "user.index.loginByOpenid",
      // relation中使用：将id转换成${name}_id
      name: "user",
      relations: {
        address: "address.index.getAddressById",
        company: "company.index.getCompanyById"
      }
    }
  ]
};
