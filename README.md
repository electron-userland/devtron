# devtron - An Electron Dev Tools Extension

## Setup

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
require('electron').remote.BrowserWindow.addDevToolsExtension('/Users/kevin/github/devtron')
```

Then a Devtron tab should appear and it will now be enabled for that
application.

You can reload the extension by closing and reopening the dev tools.
