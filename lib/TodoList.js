let TodoListCreated = require('./TodoListCreated');
let TodoAdded = require('./TodoAdded');
let TodoCompleted = require('./TodoCompleted');

function TodoList(args) {
    let uncommittedEvents = [];
    let self = {};
    let version = 0;
    let todos = [];

    let handlers = {};
    handlers['handleTodoListCreated'] = (evt) =>{
        version = evt.version;
        self.name = evt.name;
    };

    handlers['handleTodoAdded'] = (evt) => {
        version = evt.version;
        let todo = evt.todo;
        todo.id = todos.length+1;
        todos.push(todo);
    };

    handlers['handleTodoCompleted'] = (evt) => {
        version = evt.version;
        self.findTodoByID(evt.id, (err, todo) => {
            if (err !== undefined) {
                throw err;
            }
            todo.complete();
        });
    };

    if (args !== undefined && args.id === undefined) {
        apply(new TodoListCreated(args));
    }

    function apply(evt) {
        if (version == 0) {
            evt.version = 1;
        } else {
            evt.version = 100;
        }

        let eventName = evt.constructor.name;
        let method = 'handle'+eventName;

        if (handlers[method] === undefined) {
            throw new Error(`no handler for ${method}`);
        }
        handlers[method].call(self, evt);

        uncommittedEvents.push(evt);
    }

    self.uncommittedEvents = () => {
        return uncommittedEvents;
    };

    self.aggregateVersion = () => {
        return version;
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

    return self;
}

module.exports = TodoList;
