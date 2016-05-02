'use strict'

const devtools = require('./devtools')
const Event = require('../../lib/event-helpers')
const expect = require('chai').expect

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Event Helpers', () => {
  beforeEach(() => {
    global.window = devtools.create()
  })

  afterEach(() => {
    delete global.window
  })

  describe('getEvents()', () => {
    it('returns the listeners', () => {
      return Event.getEvents().then((events) => {
        expect(Object.keys(events).length).to.equal(7)

        const browserWindowEvents = events['electron.remote.getCurrentWindow()']
        expect(Object.keys(browserWindowEvents).length).to.equal(1)
        expect(browserWindowEvents['browser-window'].length).to.equal(1)
        expect(browserWindowEvents['browser-window'][0]).to.equal('function () { return 3 }')
      })
    })
  })
})
