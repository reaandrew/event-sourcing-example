const TodoList = require('../lib/TodoList');
const InMemoryEventStore = require('../lib/InMemoryEventStore');
const Todo = require('../lib/Todo');

describe('EventStore', () => {
  it('persists events for a given aggregate', (done) => {
    let list = new TodoList({
      name: 'todo something...',
    });
    let eventStore = new InMemoryEventStore();

    eventStore.save(list, () => {
      eventStore.committedEvents.length.should.equal(1);
      list.uncommittedEvents.length.should.equal(0);
      done();
    });
  });

  it('reconstitutes an aggregate from the given events in its store', () => {
    let list = new TodoList({
      name: 'todo something...',
    });
    let eventStore = new InMemoryEventStore();

    list.add(new Todo({
      name: 'get the milk',
    }));

    list.complete('get the milk', () => {
      eventStore.save(list, () => {
        let myList = eventStore.get(list.aggregateID);

        myList.version.should.equal(3);
      });
    });
  });
});
