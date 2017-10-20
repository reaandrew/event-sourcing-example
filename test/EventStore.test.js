const TodoList = require('../lib/TodoList');
const InMemoryEventStore = require('../lib/InMemoryEventStore');

describe('EventStore', () => {

  it('something does something', (done) => {
    let list = new TodoList({
      name: 'todo something...'
    });
    let eventStore = new InMemoryEventStore();

    eventStore.save(list, () => {
      eventStore.committedEvents.length.should.equal(1);
      list.uncommittedEvents.length.should.equal(0);
      done();
    });

  });

});
