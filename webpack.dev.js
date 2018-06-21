const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
};

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: PATHS.dist,
    open: true,
  },

  entry: `${PATHS.src}/scripts/index.js`,

  output: {
    path: PATHS.dist,
    filename: `${pkg.name}.js`,
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
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true,
            },
          },
        ],
      },

      // images
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
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
    // dev server
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    // templates
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.ejs',
      inject: true,
      title: pkg.name,
      description: pkg.description,
      version: pkg.version,
    }),
  ],
};
