'use strict';

document.addEventListener("DOMContentLoaded", function () {
  const table = document.querySelector('.js-requires-table')

  getRequires().then((mainModule) => {
    const addView = (module) => {
      var row = document.createElement('tr')

      var libTd = document.createElement('td')
      libTd.textContent = module.getLibrary()
      row.appendChild(libTd)

      var sizeTd = document.createElement('td')
      sizeTd.textContent = module.getSize()
      row.appendChild(sizeTd)

      var nameTd = document.createElement('td')
      var prefix = module.hasChildren() ? '+' : ''
      nameTd.textContent = `${prefix} ${module.getName()}`
      nameTd.style['padding-left'] = `${(module.getDepth()) * 15}px`
      row.appendChild(nameTd)

      table.appendChild(row)

      module.children.forEach(addView)
    }

    addView(mainModule)
  })
});
