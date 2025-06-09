import path from 'path';

const entryPoints = {
  devtron: './index.js',
  monitorMain: './externals/electron-main-tracker.js',
  monitorRenderer: './externals/electron-renderer-tracker.js',
};

const commonConfig = {
  entry: entryPoints,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // use: {
        //   loader: "babel-loader",
        //   options: {
        //     presets: ["@babel/preset-env"],
        //   },
        // },
      },
    ],
  },
  optimization: {
    minimize: false, // no minification
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: {
    electron: 'commonjs2 electron',
  },
};

const esmConfig = {
  ...commonConfig,
  output: {
    path: path.resolve('lib'),
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
};

const cjsConfig = {
  ...commonConfig,
  output: {
    path: path.resolve('lib'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs2',
    },
  },
  target: 'node',
  mode: 'none',
};

export default [esmConfig, cjsConfig];
