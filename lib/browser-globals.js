// This defines globals that will be used in the browser context
// (via the content_scripts definition in manifest.json)
//
// It is generated via `npm run-script prepublish`
const axs = require('accessibility-developer-tools')

window.__devtron = window.__devtron || {}
window.__devtron.axs = axs
