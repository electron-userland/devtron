const Eval = require('./eval')

exports.audit = () => {
  return Eval.execute(function () {
    const {axs} = window.__devtron
    const config = new axs.AuditConfiguration({showUnsupportedRulesWarning: false})
    return axs.Audit.run(config).map(function (result) {
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
          return window.__devtron.axs.utils.getQuerySelectorText(element)
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
