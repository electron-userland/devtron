const Eval = require('./eval')

exports.audit = () => {
  return Eval.execute(function () {
    const {axs} = window.__devtron
    return axs.Audit.run().filter(function (result) {
      return result.result === 'FAIL'
    }).map(function (failure) {
      return {
        code: failure.rule.code,
        severity: failure.rule.severity.toLowerCase(),
        title: failure.rule.heading,
        url: failure.rule.url,
        elements: failure.elements.map(function (element) {
          return __devtron.axs.utils.getQuerySelectorText(element)
        })
      }
    })
  })
}
