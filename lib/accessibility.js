const Eval = require('./eval')

exports.audit = () => {
  return Eval.execute(function () {
    const {axs} = window.__devtron
    return axs.Audit.run().map(function (result) {
      const elements = result.elements || []
      return {
        code: result.rule.code,
        severity: result.rule.severity,
        status: result.result,
        title: result.rule.heading,
        url: result.rule.url,
        elements: elements.map(function (element) {
          return __devtron.axs.utils.getQuerySelectorText(element)
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
        if (statusA === 'FAIL') return -1
        if (statusB === 'FAIL') return 1

        if (statusA === 'PASS') return -1
        if (statusB === 'PASS') return 1
      }
    })
  })
}
