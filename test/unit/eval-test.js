'use strict'

const devtools = require('./devtools')
const Eval = require('../../lib/eval')
const path = require('path')

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Eval', () => {
  this.timeout(process.env.CI ? 60000 : 30000)

  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

  describe('execute(expression, ...args)', () => {
    it('returns a promise that resolves to the value of the specified expression', () => {
      return Eval.execute('1+1').should.eventually.equal(2)
    })

    it('returns a rejected promise on errors', () => {
      return Eval.execute('+-').should.be.rejected
    })

    it('accepts a function with no arguments', () => {
      return Eval.execute(() => 3).should.eventually.equal(3)
    })

    it('accepts a function with arguments', () => {
      return Eval.execute((x, y) => x + y, 1, 2).should.eventually.equal(3)
    })
  })

  describe('getFileSize(filePath)', () => {
    it('returns the size of the file', () => {
      return Eval.getFileSize(path.join(__dirname, '..', 'fixtures', 'foo.txt')).should.eventually.equal(15)
    })

    it('returns -1 for files that do not exist', () => {
      return Eval.getFileSize(path.join(__dirname, '..', 'fixtures', 'does-not-exist.txt')).should.eventually.equal(-1)
    })
  })

  describe('getFileVersion(filePath)', () => {
    it('returns the version from the parent package.json', () => {
      return Eval.getFileVersion(path.join(__dirname, '..', 'fixtures', 'node_modules', 'foo', 'index.js')).should.eventually.equal('1.2.3')
    })

    it('returns the electron version for paths inside the api asar file', () => {
      return Eval.getFileVersion('/Electron.app/Contents/Resources/atom.asar/renderer/init.js').should.eventually.equal('1.0.0')
    })
  })
})
