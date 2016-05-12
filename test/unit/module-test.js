const devtools = require('./devtools')
const expect = require('chai').expect
const Module = require('../../lib/module')
const Modules = require('../../lib/module-helpers')

const afterEach = global.afterEach
const beforeEach = global.beforeEach
const describe = global.describe
const it = global.it

describe('Module', function () {
  this.timeout(process.env.CI ? 60000 : 30000)

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
      expect(root.getId()).to.equal('my app')
    })
  })

  describe('getMainModules()', () => {
    it('returns the main module and child modules', () => {
      return Modules.getMainModules().then((mainModule) => {
        expect(mainModule.appName).to.equal('Devtron')
        expect(mainModule.totalSize).to.be.above(0)
        expect(mainModule.getLibrary()).to.equal('mocha')
        expect(mainModule.getId()).to.equal('mocha')
        expect(mainModule.getName()).to.equal('_mocha')
        expect(mainModule.hasChildren()).to.be.true
        expect(mainModule.getPath()).to.equal(process.mainModule.filename.replace(/\\/g, '/'))
        expect(mainModule.getSize()).to.be.above(0)
        expect(mainModule.getDepth()).to.equal(1)
        expect(mainModule.getVersion()).not.to.be.empty
      })
    })
  })

  describe('getRenderModules()', () => {
    it('returns the main module and child modules', () => {
      return Modules.getRenderModules().then((mainModule) => {
        expect(mainModule.appName).to.equal('Devtron')
        expect(mainModule.totalSize).to.be.above(0)
        expect(mainModule.getLibrary()).to.equal('mocha')
        expect(mainModule.getId()).to.equal('mocha')
        expect(mainModule.getName()).to.equal('_mocha')
        expect(mainModule.hasChildren()).to.be.true
        expect(mainModule.getPath()).to.equal(process.mainModule.filename.replace(/\\/g, '/'))
        expect(mainModule.getSize()).to.be.above(0)
        expect(mainModule.getDepth()).to.equal(1)
        expect(mainModule.getVersion()).not.to.be.empty
      })
    })
  })
})
