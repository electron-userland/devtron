'use strict'

const objectPrototype = Object.getPrototypeOf({})

const isCustomClass = (object, prototype) => {
  if (typeof object !== 'object') return false
  if (Array.isArray(object)) return false

  return prototype && prototype !== objectPrototype
}

const checkAPI = (apis, parent, name, value) => {
  const api = parent + '.' + name
  if (typeof value === 'object') {
    findChromeAPIs(apis, api, value)
  } else {
    apis[api] = true
  }
}

const findChromeAPIs = (apis, parent, object) => {
  for (const name in object) {
    checkAPI(apis, parent, name, object[name])
  }

  const prototype = Object.getPrototypeOf(object)
  if (isCustomClass(object, prototype)) {
    Object.getOwnPropertyNames(prototype).filter((name) => {
      return name !== 'constructor'
    }).forEach((name) => {
      checkAPI(apis, parent, name, object[name])
    })
  }

  return Object.keys(apis)
}

exports.getChromeAPIs = () => findChromeAPIs({}, 'chrome', window.chrome)
