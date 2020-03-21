# <img src="https://cloud.githubusercontent.com/assets/378023/15063285/cf554e40-1383-11e6-9b9c-45d381b03f9f.png" width="60px" align="center" alt="Devtron icon"> Devtron

An [Electron](https://electronjs.org) [DevTools](https://developer.chrome.com/devtools)
extension to help you inspect, monitor, and debug your app.

[![Travis Build Status](https://travis-ci.org/electron-userland/devtron.svg?branch=master)](https://travis-ci.org/electron-userland/devtron)
[![GitHub Actions Build Status](https://github.com/electron-userland/devtron/workflows/CI/badge.svg)](https://github.com/electron-userland/devtron/actions?query=workflow%3ACI)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![downloads:?](https://img.shields.io/npm/dm/devtron.svg)](https://www.npmjs.com/packages/devtron)

![screenshot](https://cloud.githubusercontent.com/assets/378023/15036521/e3e7cd06-12ca-11e6-8054-ed0455015f05.png)

## Features

  * **Require graph** to help you visualize your app's internal and external
    library dependencies in both the main and renderer processes.
  * **IPC monitor** to track and inspect the messages sent and received
    between the renderer and main processes in your app.
  * **Event inspector** that shows the events and listeners that are registered
    in your app on the core Electron APIs such as the window, the app, and the
    processes.
  * **App Linter** that checks your apps for possible issues and missing
    functionality.

## Installing

```sh
npm install --save-dev devtron
```

Then execute the following from the Console tab of your running Electron app's
developer tools:

```js
require('devtron').install()
```

You should then see a `Devtron` tab added.

## Disabled Node Integration

If your application's `BrowserWindow` was created with `nodeIntegration` set
to `false` then you will need to expose some globals via a [preload](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions)
script to allow Devtron access to Electron APIs:

```js
window.__devtron = {require: require, process: process}
```

Then restart your application and Devtron should successfully load. You may
want to guard this assignment with a `if (process.env.NODE_ENV === 'development')`
check to ensure these variables aren't exposed in production.

## Developing locally

```
git clone https://github.com/electron/devtron
cd devtron
npm install
npm start
```

This will start a process that watches and compiles the extension as files
are modified.

Then open the Console tab of your Electron app and run the following with the
path updated for the location that you've cloned devtron to:

```js
require('/Users/me/code/devtron').install()
```

Then a Devtron tab should appear and it will now be enabled for that
application.

You can reload the extension by closing and reopening the dev tools.

### Running in a browser

To make developing and debugging the extension easier, you can run it in a
Chrome tab that will talk remotely to a running Electron app over HTTP.

- Set the `DEVTRON_DEBUG_PATH` environment variable to the path of the cloned
  devtron repository.
- Start your Electron application.
- Click the **Devtron** tab.
- You should then see the following messages logged to the **Console** tab:

  > Devtron server listening on http://localhost:3948
  >
  > Open file:///Users/me/devtron/static/index.html to view

- Then open `/Users/me/devtron/static/index.html` in Chrome
- The page there will talk remotely to the running Electron app so you'll
  be able to fully interact with each pane with real data.
  
### Additional Notes

- `require('devtron').install()` cannot be called before the `ready` event of the `app` module has been emitted.

#### Webpack

When using webpack, you may experience issues resolving `__dirname`. In accordance with the [docs](https://webpack.js.org/configuration/node/#node-__dirname), `__dirname` is resolved at runtime on the compiled file.

You have to two solutions: 
 1. Remove `devtron` from Webpack bundle with `config.externals`
 2. Copy `devtron` files to the same folder as your compiled main process file

#### [Solution 1] Remove from webpack bundle

```js
config.externals = [
  function(context, request, callback) {
    if (request.match(/devtron/)) {
      return callback(null, 'commonjs ' + request)
    }

    callback()
  }
]
```

#### [Solution 2] Copy devtron files
 1. Make sure that webpack does not replace `__dirname` by setting:
   ```js
   // in your webpack config for main process
   {
     target: 'electron-main',
     node: {
       __dirname: false,
     }
   }
   ```
 2. Ensure that the copy target for `devtron/manifest.json` is the same folder as your compiled main process `js` file.
 3. Ensure that the copy target for the `devtron/out/browser-globals.js` is `out/browser-globals.js` relative to your compiled main process `js` file.
 
You can copy files with `copy-webpack-plugin`.

```js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyFiles = [
  {
    from: path.resolve(__dirname, 'node_modules/devtron/manifest.json')
  }, 
  {
    from: path.resolve(__dirname, 'node_modules/devtron/out/browser-globals.js'),
    to: path.resolve(__dirname, 'out'),
  }
];

config.target = 'electron-main',
config.plugins = [
  new CopyWebpackPlugin(copyFiles),
]
```

## Contributing

Have an idea for something this extension could do to make debugging Electron
apps easier? Please [open an issue](https://github.com/electron/devtron/issues/new).

Pull requests are also welcome and appreciated. Run `npm test` to run the
existing tests. This project uses the [standard JavaScript style](http://standardjs.com).

## License

MIT
