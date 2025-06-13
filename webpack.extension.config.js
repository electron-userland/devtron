import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'node:path';

export default {
  mode: 'production',
  entry: {
    contentScript: './src/content/index.js',
    background: './src/background/index.js',
    devtools: './src/devtools/devtools.js',
    react: './src/react/index.jsx',
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('manifest.json'), // copies manifest file to the dist folder
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/devtools/devtools.html'), // copies devtools HTML file to the dist folder
          to: path.resolve('dist'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // to transpile modern JavaScript and JSX to a code that browsers can understand
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
