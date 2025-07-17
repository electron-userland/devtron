import path from 'node:path';
import { DefinePlugin, type Configuration } from 'webpack';

const entryPoints = {
  index: './src/index.ts',
  'electron-renderer-tracker': './src/lib/electron-renderer-tracker.ts',
  'service-worker-preload': './src/lib/service-worker-preload.ts',
};

const commonConfig: Configuration = {
  mode: 'production',
  entry: entryPoints,
  module: {
    parser: {
      javascript: {
        importMeta: false,
        createRequire: false,
      },
    },
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  optimization: {
    minimize: false,
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
