'use strict'

const devtools = require('./devtools')
const ipc = require('../../lib/ipc-helpers')
const expect = require('chai').expect

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('IPC Helpers', () => {
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
        require('electron').ipcRenderer.emit('foo', {}, 'bar')
        return ipc.getEvents()
      }).then((events) => {
        expect(events.length).to.equal(1)

        const event = events[0]
        expect(event.channel).to.equal('foo')
        expect(event.data).to.equal('["bar"]')
        expect(event.sync).to.be.false
        expect(event.sent).to.be.false

      }).then(ipc.getEvents).then((events) => {
        expect(events.length).to.equal(0)
      })
    })
  })
})
