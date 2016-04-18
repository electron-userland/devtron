'use strict'

const events = require('./event-helpers')
const EmitterView = require('./emitter-view')
const View = require('./view')

class EventsView extends View {
  constructor () {
    super('js-events-view')
    this.render()
  }

  render () {
    events.getEvents().then((events) => {
      const emitterViews = Object.keys(events).map((name) => {
        return new EmitterView(name, events[name], this.listenersTable)
      })
      emitterViews[0].select()
    }).catch((error) => {
      console.error('Getting event listeners failed')
      console.error(error.stack || error)
    })
  }
}

module.exports = EventsView
