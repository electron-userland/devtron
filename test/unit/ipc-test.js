'use strict'

const devtools = require('./devtools')
const ipc = require('../../lib/ipc-helpers')
const expect = require('chai').expect

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('IPC Helpers', () => {
  this.timeout(process.env.CI ? 60000 : 30000)

  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

  describe('getEvents()', () => {
    it('returns an empty events array when not listening', () => {
      return ipc.getEvents().then((events) => {
        expect(events.length).to.equal(0)
      })
    })

    it('returns the emitted IPC events', () => {
      return ipc.listenForEvents().then(() => {
        require('electron').ipcRenderer.emit('foo', {}, 'bar', 'baz')
        require('electron').ipcRenderer.send('bar', 'hey', 3)
        require('electron').ipcRenderer.sendSync('baz', 'hi', false)

        return ipc.getEvents()
      }).then((events) => {
        expect(events.length).to.equal(4)

        expect(events[0].channel).to.equal('foo')
        expect(events[0].data).to.equal('["bar","baz"]')
        expect(events[0].sync).to.be.false
        expect(events[0].sent).to.be.false

        expect(events[1].channel).to.equal('bar')
        expect(events[1].data).to.equal('["hey",3]')
        expect(events[1].sync).to.be.false
        expect(events[1].sent).to.be.true

        expect(events[2].channel).to.equal('baz')
        expect(events[2].data).to.equal('["hi",false]')
        expect(events[2].sync).to.be.true
        expect(events[2].sent).to.be.true

        expect(events[3].channel).to.equal('baz')
        expect(events[3].data).to.equal('[null]')
        expect(events[3].sync).to.be.true
        expect(events[3].sent).to.be.false
      }).then(ipc.getEvents).then((events) => {
        expect(events.length).to.equal(0)
      })
    })

    it('ignores certain internal events', () => {
      return ipc.listenForEvents().then(() => {
        require('electron').ipcRenderer.emit('ELECTRON_BROWSER_DEREFERENCE', {}, 'bar')
        return ipc.getEvents()
      }).then((events) => {
        expect(events.length).to.equal(0)
      })
    })
  })
})
