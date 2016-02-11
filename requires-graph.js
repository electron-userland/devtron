'use strict';

const createView = (node) => {
  var element = document.createElement('li')

  var box = document.createElement('div')
  box.classList.add('node-box')
  box.textContent = node.name
  element.appendChild(box)

  element.classList.add('graph-entry')

  var list = document.createElement('ul')
  list.classList.add('child-nodelist')
  node.children.forEach((child) => {
    list.appendChild(createView(child))
  })
  element.appendChild(list)
  return element
}


document.addEventListener("DOMContentLoaded", function () {
  getRequireGraph().then(function (graph) {
    document.querySelector('.js-require-graph').appendChild(createView(graph))
  })
})
