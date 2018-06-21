const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
};

// add entries here
const ENTRIES = {};
ENTRIES[pkg.name] = `${PATHS.src}/scripts/index.js`;

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: ENTRIES,

  output: {
    path: PATHS.dist,
    filename: `[name].js`,
  },

  module: {
    rules: [
      // scripts
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    // general
    new CleanWebpackPlugin([PATHS.dist]),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
};
