# Devtron

> [!NOTE]
> This project is under development and subject to change.

## Building and Development

- Clone the repository to your local machine
- Run `npm install` to install dependencies
- Run `npm link` to link the package globally
- Run `npm run build` to build the project

#### Configuring an Electron App to use Devtron

- In your Electron app run `npm link @electron/devtron` to link the Devtron package
- In your Electron app's `main.js` (or other relevant file) add the following code to load Devtron:

```js
//main.js
const { devtron } = require('@hitarth-gg/devtron');
// or import { devtron } from '@hitarth-gg/devtron'

devtron.install(); // call this function at the top of your file
```

or call `devtron.install()` inside the `app.whenReady()` callback like this:

```js
// main.js
const { devtron } = require('@hitarth-gg/devtron');
// or import { devtron } from '@hitarth-gg/devtron'

// function createWindow() {...}

app.whenReady().then(() => {
  devtron.install();
  // ...
});
```

If Devtron is installed correctly, it should appear as a tab in the Developer Tools of your Electron app.

<img src="https://github.com/user-attachments/assets/0f278b54-50fe-4116-9317-9c1525bf872b" width="800">
