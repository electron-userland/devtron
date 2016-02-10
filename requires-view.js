'use strict';

document.addEventListener("DOMContentLoaded", function () {
  getRequires().then((requires) => {
    const table = document.querySelector('.js-requires-table')
    requires.forEach((require) => {
      var row = document.createElement('tr')
      var nameTd = document.createElement('td')
      nameTd.textContent = require.name
      row.appendChild(nameTd)
      var libTd = document.createElement('td')
      libTd.textContent = require.library
      row.appendChild(libTd)
      table.appendChild(row)
    })
  })
});
