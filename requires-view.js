'use strict';

document.addEventListener("DOMContentLoaded", function () {
  const table = document.querySelector('.js-requires-table')

  getRequires().then((modules) => {
    modules.forEach((module) => {
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

      table.appendChild(row)
    })
  })
});
