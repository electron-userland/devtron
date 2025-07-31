import path from 'node:path';
import { DefinePlugin, type Configuration } from 'webpack';

const entryPoints = {
  index: './src/index.ts',
  'renderer-preload': './src/lib/renderer-preload.ts',
  'service-worker-preload': './src/lib/service-worker-preload.ts',
};

const commonConfig: Configuration = {
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
      __dirname: 'import.meta.url',
    }),
  ],
  externals: {
    electron: 'module electron',
  },
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
  externals: {
    electron: 'commonjs2 electron',
  },
};

const config: Configuration[] = [esmConfig, cjsConfig];
export default config;
