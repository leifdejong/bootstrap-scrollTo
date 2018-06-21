const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
    filename: `js/[name].js`,
  },

  module: {
    rules: [
      // scripts
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      // styles
      {
        test: /\.(scss|css|sass)$/,

        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },

      // files and images
      {
        test: /\.(gif|png|jpe?g|svg|pdf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'public/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // general
    new CleanWebpackPlugin([PATHS.dist]),

    // styles
    new ExtractTextPlugin('css/styles.css', {
      allChunks: true,
    }),

    // templates
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.ejs',
      title: pkg.name,
      description: pkg.description,
      version: pkg.version,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/](node_modules|vendor)[\\/]/,
          name: 'vendor',
          enforce: true,
          chunks: 'all',
        },
      },
    },

    minimizer: [
      // scripts
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),

      // styles
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
          map: {
            inline: false,
          },
        },
        canPrint: true,
      }),
    ],
  },
};
