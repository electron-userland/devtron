import path from 'node:path';
import { DefinePlugin, type Configuration } from 'webpack';

const entryPoints = {
  index: './src/index.ts',
  'electron-main-tracker': './src/lib//electron-main-tracker.ts',
  'electron-renderer-tracker': './src/lib/electron-renderer-tracker.ts',
};

const commonConfig: Configuration = {
  entry: entryPoints,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    electron: 'commonjs2 electron',
  },
};

const esmConfig: Configuration = {
  ...commonConfig,
  output: {
    path: path.resolve('dist', 'mjs'),
    filename: '[name].mjs',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  target: ['node', 'es2020'],
  mode: 'none',
  plugins: [
    new DefinePlugin({
      __MODULE_TYPE__: JSON.stringify('mjs'),
    }),
  ],
};

const cjsConfig: Configuration = {
  ...commonConfig,
  output: {
    path: path.resolve('dist', 'cjs'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs2',
    },
  },
  target: 'node',
  mode: 'none',
  plugins: [
    new DefinePlugin({
      __MODULE_TYPE__: JSON.stringify('cjs'),
    }),
  ],
};

const config: Configuration[] = [esmConfig, cjsConfig];
export default config;
