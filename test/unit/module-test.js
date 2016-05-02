const Module = require('../lib/module')
const expect = require('chai').expect

const describe = global.describe
const it = global.it

describe('Module', () => {
  describe('main module', () => {
    it('provides details about the module', () => {
      const root = new Module('/apps/my-app/lib/bar', '/apps/my-app', 'My App')
      expect(root.hasChildren()).to.be.false
      expect(root.getName()).to.equal('bar')
      expect(root.getDepth()).to.equal(1)
      expect(root.getDirectory()).to.equal('lib')
      expect(root.getLibrary()).to.equal('My App')
    })
  })
})
