const uuidv4 = require('uuid/v4')

let TodoListCreated = require('./TodoListCreated');
let TodoAdded = require('./TodoAdded');
let TodoCompleted = require('./TodoCompleted');

function TodoList(args) {
    const self = {};
    self.uncommittedEvents = [];
    self.version = 0;
    let todos = [];

    let handlers = {};
    handlers['handleTodoListCreated'] = (evt) =>{
        self.name = evt.name;
        self.aggregateID = evt.aggregateID;
    };

    handlers['handleTodoAdded'] = (evt) => {
        let todo = evt.todo;
        todo.id = todos.length+1;
        todos.push(todo);
    };

    handlers['handleTodoCompleted'] = (evt) => {
        self.findTodoByID(evt.id, (err, todo) => {
            if (err !== undefined) {
                throw err;
            }
            todo.complete();
        });
    };

    function handle(evt) {
      let eventName = evt.constructor.name;
      let method = 'handle'+eventName;

      if (handlers[method] === undefined) {
          throw new Error(`no handler for ${method}`);
      }
      handlers[method].call(self, evt);
    }

    function apply(evt) {

        evt.eventId = uuidv4();
        evt.timestamp = Date.now();
        if (self.version == 0) {
            self.version = evt.version = 1;
        } else {
            evt.version = self.version + self.uncommittedEvents.length;
        }

        handle(evt)

        evt.aggregateID = self.aggregateID;

        self.uncommittedEvents.push(evt);
    }

    function replay(events) {
      events.forEach((evt) => {
        self.aggregateID = evt.aggregateID;
        self.version = evt.version;
        handle(evt);
      });
    }

    self.aggregateVersion = () => {
        return self.version;
    };

    self.add = (todo) => {
        apply(new TodoAdded(todo));
    };

    self.complete = (todoName, callback) => {
        self.findTodoByName(todoName, (err, todo) => {
            if (err !== undefined) {
                throw err;
            }
            apply(new TodoCompleted(todo.id));
            callback();
        });
    };

    self.findTodoByName = (todoName, callback) => {
        let item = todos.find((element) => {
            return element.name == todoName;
        });

        if (item === undefined) {
            callback(Error(`todo not found by name of: ${todoName}`));
        } else {
            callback(undefined, item);
        }
    };

    self.findTodoByID = (id, callback) => {
        let item = todos.find((element) => {
            return element.id == id;
        });

        if (item === undefined) {
            callback(Error(`not found by id of: ${id}`));
        } else {
            callback(undefined, item);
        }
    };

    (function init(){
        if (args !== undefined && args.events !== undefined) {
            replay(args.events);
        }
        if (args !== undefined && args.id === undefined) {
            args.aggregateID = uuidv4();
            apply(new TodoListCreated(args));
        }
    })();

    return self;
}

module.exports = TodoList;
