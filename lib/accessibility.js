const Eval = require('./eval')

exports.audit = () => {
  return Eval.execute(function () {
    const {axs} = window.__devtron
    const failures = axs.Audit.run().filter(function (result) {
      return result.result === 'FAIL'
    })

    const results = {
      errors: {},
      warnings: {}
    }

    failures.forEach(function (failure) {
      const result = {
        code: failure.rule.code,
        title: failure.rule.heading,
        url: failure.rule.url,
        elements: failure.elements.map(function (element) {
          return __devtron.axs.utils.getQuerySelectorText(element)
        })
      }

      if (failure.rule.severity === 'Warning') {
        results.warnings[result.code] = result
      } else if (failure.rule.severity === 'Severe') {
        results.errors[result.code] = result
      }
    })

    return results
  })
}
