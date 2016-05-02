const devtools = require('./devtools')
const expect = require('chai').expect
const Module = require('../../lib/module')
const Modules = require('../../lib/module-helpers')

const afterEach = global.afterEach
const beforeEach = global.beforeEach
const describe = global.describe
const it = global.it

describe('Module', () => {
  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

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

  describe('getMainModules()', () => {
    it('returns the main module and child modules', () => {
      return Modules.getMainModules().then((mainModule) => {
        expect(mainModule.appName).to.equal('Devtron')
        expect(mainModule.getLibrary()).to.equal('mocha')
        expect(mainModule.getName()).to.equal('_mocha')
        expect(mainModule.hasChildren()).to.be.true
        expect(mainModule.getPath()).to.equal(process.mainModule.filename)
      })
    })
  })

  describe('getRenderModules()', () => {
    it('returns the main module and child modules', () => {
      return Modules.getRenderModules().then((mainModule) => {
        expect(mainModule.appName).to.equal('Devtron')
        expect(mainModule.getLibrary()).to.equal('mocha')
        expect(mainModule.getName()).to.equal('_mocha')
        expect(mainModule.hasChildren()).to.be.true
        expect(mainModule.getPath()).to.equal(process.mainModule.filename)
      })
    })
  })
})
