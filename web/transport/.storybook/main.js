const path = require('path');
const include = path.resolve(__dirname, '../');
const appPath = path.resolve(__dirname, '../src');

module.exports = {
  stories: ['../**/story.tsx'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.module = {
      rules: [
        {
          test: /\.tsx?/,
          loader: 'babel-loader!ts-loader',
          exclude: /node_modules/,
          include,
        },
      ],
    };

    config.resolve = {
      alias: {
        assets: `${appPath}/assets`,
        components: `${appPath}/components`,
        core: `${appPath}/core`,
        screens: `${appPath}/screens`,
        scenes: `${appPath}/scenes`,
        styles: `${appPath}/styles`,
        utils: `${appPath}/utils`,
      },
      extensions: ['.js', '.ts', '.tsx'],
    };

    return config;
  },
};
