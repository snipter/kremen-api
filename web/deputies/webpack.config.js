const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('./package.json');

const appPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = env => {
  const envFile = env.ENVFILE ? env.ENVFILE : '.env';
  require('dotenv').config({
    path: path.resolve(process.cwd(), envFile),
  });
  return {
    entry: {
      app: `${appPath}/index.tsx`,
    },
    output: {
      path: distPath,
      filename: '[name]-[hash].js',
      publicPath: '/',
    },
    resolve: {
      alias: {
        assets: `${appPath}/assets`,
        components: `${appPath}/components`,
        core: `${appPath}/core`,
        screens: `${appPath}/screens`,
        navigation: `${appPath}/navigation`,
        scenes: `${appPath}/scenes`,
        store: `${appPath}/store`,
        styles: `${appPath}/styles`,
        utils: `${appPath}/utils`,
      },
      extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
      rules: [
        { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
        // Use url-loader for the files under 10k, for other cases - file-loader
        { test: /\.(md)/, use: [{ loader: 'raw-loader' }] },
        {
          test: /\.(woff|woff2|eot|ttf|svg|png|jpg)/,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 100000, name: 'assets/[name].[ext]' },
            },
          ],
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: package.title,
        company: package.company,
        description: package.description,
        url: package.url,
        keywords: package.keywords,
        filename: 'index.html',
        template: 'src/templates/app.ejs',
        hash: true,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
        },
      }),
      new CopyWebpackPlugin([
        { from: 'src/assets/img/*.{png,jpg}', to: 'assets', flatten: true },
        { from: 'src/assets/photos/*.{png,jpg}', to: 'photos', flatten: true },
      ]),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(package.version),
        ENV: JSON.stringify(process.env.ENV),
        MAPS_API_KEY: JSON.stringify(process.env.MAPS_API_KEY),
        APP_TITLE: JSON.stringify(package.title),
        APP_COMPANY: JSON.stringify(package.company),
        APP_DESCRIPTION: JSON.stringify(package.description),
        APP_URL: JSON.stringify(package.url),
      }),
    ],
    devServer: {
      port: process.env.PORT || 6002,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    node: {
      net: 'empty',
      tls: 'empty',
      dns: 'empty',
    },
  };
};
