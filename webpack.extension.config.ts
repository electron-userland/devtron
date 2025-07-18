import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'node:path';
import { IgnorePlugin, type Configuration } from 'webpack';
const config: Configuration = {
  mode: 'production',
  entry: {
    contentScript: './src/extension/content/index.ts',
    background: './src/extension/background/index.ts',
    devtools: './src/extension/devtools/devtools.ts',
    react: './src/extension/react/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist/extension'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/extension/index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'manifest.json'),
          to: path.resolve(__dirname, 'dist/extension'),
        },
        {
          from: path.resolve(__dirname, 'src/extension/devtools/devtools.html'),
          to: path.resolve(__dirname, 'dist/extension'),
        },
      ],
    }),
    new IgnorePlugin({
      resourceRegExp: /..\/test_data\/test_data$/, // to ignore test_data in production build
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
};

export default config;
