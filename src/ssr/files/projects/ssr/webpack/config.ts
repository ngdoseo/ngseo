const path = require('path');
const webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
import chalk from 'chalk';


export const webpackSSRConfig = {
  entry: { static: './projects/ssr/webpack/static.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  mode: 'none',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [nodeExternals(
    {
      modulesFromFile: {
        include:['devDependencies']
      }
    }
  )],
  output: {
    path: "",
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: [/node_modules\/puppeteer/] }
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for 'WARNING Critical dependency: the request of a dependency is an expression'
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    ),
    new ProgressBarPlugin({
        format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      })
  ]
};
