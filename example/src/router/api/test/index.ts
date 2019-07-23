export default {
  returnKey: "test",
  workflow: [
    {
      type: "relation",
      memory: "test",
      params: ["params"],
      relationName: "test",
      relationParam: "param",
      relationServiceMap: {
        address: "test.index.test"
      }
    }
    // {
    //   type: 'service',
    //   memory: 'test',
    //   params: ['params'],
    //   service: 'test.index.test'
    // }
    // {
    //   type: 'custom',
    //   memory: 'test',
    //   params: [],
    //   handler: () => ({ code: 0, message: '测试', data: null })
    // }
  ]
};
