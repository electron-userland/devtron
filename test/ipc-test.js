'use strict'

const devtools = require('./devtools')
const ipc = require('../lib/ipc-helpers')
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
  })
})
