const path = require('path');
const include = path.resolve(__dirname, '../');
const appPath = path.resolve(__dirname, '../src');

module.exports = {
  plugins: [],
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: 'babel-loader!ts-loader',
        exclude: /node_modules/,
        include,
      },
    ],
  },
  resolve: {
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
  },
};
