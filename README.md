# Devtron
> [!NOTE]
> This project is under development and subject to change.

## Building and Development
- Clone the repository to your local machine
- Run `npm install` to install dependencies
- Run `npm link` to link the package globally
- Run `npm run build` to build the project

#### Configuring an Electron App to use Devtron
- In your Electron app run `npm link devtron` to link the Devtron package
- In your Electron app's `main.js` (or other relevant file) add the following code to load Devtron:
```js
// main.js
const { devtron } = require('devtron')
const { monitorMain } = require('devtron/monitorMain')
monitorMain()

// function createWindow() {...}

app.whenReady().then(() => {
  devtron.install()
  // ...
})
```
- In your Electron app's `preload.js` (or other relevant file) add the following code to load Devtron:
```js
// preload.js
const { monitorRenderer } = require('devtron/monitorRenderer')
monitorRenderer()
```

If Devtron is installed correctly, it should appear as a tab in the Developer Tools of your Electron app.
![image](https://i.ibb.co/C3WgrHKG/Screenshot-2025-06-09-171027.png)
