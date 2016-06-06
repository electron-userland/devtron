'use strict'

const findChromeAPIs = (apis, parent, object) => {
  for (const property in object) {
    const api = parent + '.' + property
    if (typeof object[property] === 'object') {
      findChromeAPIs(apis, api, object[property])
    } else {
      apis.push(api)
    }
  }
  return apis
}

exports.getChromeAPIs = () => findChromeAPIs([], 'chrome', window.chrome)
