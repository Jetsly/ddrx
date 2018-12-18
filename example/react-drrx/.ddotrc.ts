export default {
  plugins: [
    [
      'webpack',
      {
        chainWebpack(config) {
          config
            .entry('index')
            .add('./src/index')
            .end();
        },
      },
    ],
  ],
};
