const TodoList = require('./TodoList');

function InMemoryEventStore() {
  let self = {};
  self.committedEvents = [];

  self.save = function(aggregate, callback) {
    aggregate.uncommittedEvents
          .forEach((member) => self.committedEvents.push(member));

    aggregate.uncommittedEvents = [];
    callback();
  };

  self.get = function(id) {
    let aggregateEvents = self.committedEvents
          .filter((event) => event.aggregateID = id);
    let list = new TodoList({
      events: aggregateEvents,
    });
    return list;
  };

  return self;
}

module.exports = InMemoryEventStore;
