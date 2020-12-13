const path = require('path')
const del = require('del')
const HtmlWebpackPlugin = require('html-webpack-plugin')

del.sync([path.resolve(__dirname, 'dist/**/*')])

/** @type {import('webpack').Configuration} */
const config = {
  watch: true,
  mode: 'development',
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg|woff2?|ttf|eot)$/,
        use: 'url-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}

/** @type {import('webpack').Configuration} */
const mainConfig = {
  ...config,
  target: 'electron-main',
  entry: {
    main: './src/main.ts',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    __dirname: false,
  },
}

/** @type {import('webpack').Configuration} */
const pageConfig = {
  ...config,
  entry: {
    devtron: './src/devtron.ts',
    index: './src/index.tsx',
    background: './src/background.ts',
    'content-script': './src/content-script.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'devtron',
      filename: 'devtron.html',
      chunks: ['devtron'],
    }),
    new HtmlWebpackPlugin({
      title: 'devtron',
      filename: 'index.html',
      chunks: ['index'],
    }),
  ],
}

module.exports = [mainConfig, pageConfig]
