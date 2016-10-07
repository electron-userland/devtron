const Eval = require('./eval')

exports.audit = () => {
  return Eval.execute(function () {
    const {axs} = window.__devtron // defined in browser-globals.js
    const config = new axs.AuditConfiguration({showUnsupportedRulesWarning: false})
    const results = axs.Audit.run(config)

    // Create a lookup map so users can click on an element to inspect it
    let idCounter = 0
    window.__devtron.accessibilityAuditMap = new Map()
    results.forEach(function (result) {
      const elements = result.elements || []
      elements.forEach(function (element) {
        const id = idCounter++
        element.__accessibilityAuditId = id
        window.__devtron.accessibilityAuditMap.set(id, element)
      })
    })

    return results.map(function (result) {
      const elements = result.elements || []
      let status = 'N/A'
      if (result.result === 'PASS') {
        status = 'Pass'
      } else if (result.result === 'FAIL') {
        status = 'Fail'
      }
      return {
        code: result.rule.code,
        severity: result.rule.severity,
        status: status,
        title: result.rule.heading,
        url: result.rule.url,
        elements: elements.map(function (element) {
          let selector = element.tagName.toLowerCase()
          if (element.className) {
            selector += '.' + element.className.split(' ').join('.')
          }
          return {
            selector: selector,
            id: element.__accessibilityAuditId
          }
        })
      }
    }).sort(function (resultA, resultB) {
      const statusA = resultA.status
      const statusB = resultB.status
      const severityA = resultA.severity
      const severityB = resultB.severity

      if (statusA === statusB) {
        if (severityA === severityB) {
          return resultB.elements.length - resultA.elements.length
        }

        if (severityA === 'Severe') return -1
        if (severityB === 'Severe') return 1

        if (severityA === 'Warning') return -1
        if (severityB === 'Warning') return 1
      } else {
        if (statusA === 'Fail') return -1
        if (statusB === 'Fail') return 1

        if (statusA === 'Pass') return -1
        if (statusB === 'Pass') return 1
      }
    })
  })
}
