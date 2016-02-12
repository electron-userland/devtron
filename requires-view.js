'use strict';

document.addEventListener("DOMContentLoaded", function () {
  const table = document.querySelector('.js-requires-table')

  getRequires().then((mainModule) => {
    const addView = (module) => {
      var row = document.createElement('tr')

      var nameTd = document.createElement('td')
      nameTd.textContent = module.getName()
      row.appendChild(nameTd)

      var sizeTd = document.createElement('td')
      sizeTd.textContent = module.getSize()
      row.appendChild(sizeTd)

      var libTd = document.createElement('td')
      libTd.textContent = module.getLibrary()
      row.appendChild(libTd)

      var parentTd = document.createElement('td')
      parentTd.textContent = module.getParentLibrary()
      row.appendChild(parentTd)

      table.appendChild(row)

      module.children.forEach(addView)
    }

    addView(mainModule)
  })
});
