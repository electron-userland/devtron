'use strict';

const evalInWindow = (expression) => {
  return new Promise((resolve, reject) => {
    chrome.devtools.inspectedWindow.eval(expression, (result, error) => {
      if (error)
        reject(error)
      else
        resolve(result)
    })
  })
}

evalInWindow("Object.keys(require.cache)").then((paths) => {
  document.write('Paths: ' + paths)
})
