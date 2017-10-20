function InMemoryEventStore() {
  var self = {};
  self.committedEvents = [];

  self.save = function(aggregate, callback) {

    aggregate.uncommittedEvents.forEach(member => self.committedEvents.push(member));

    aggregate.uncommittedEvents = [];
    callback();
  }

  return self;
}

module.exports = InMemoryEventStore;
