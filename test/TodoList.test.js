let should = require('should');

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
            throw new Error('no handler for ' + method);
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
            callback(Error('todo not found by name of: ' + todoName));
        } else {
            callback(undefined, item);
        }
    };

    self.findTodoByID = (id, callback) => {
        let item = todos.find((element) => {
            return element.id == id;
        });

        if (item === undefined) {
            callback(Error('not found by id of: ' + id));
        } else {
            callback(undefined, item);
        }
    };

    return self;
}

function Todo(args) {
    let self = {};
    self.id = args.id;
    self.name = args.name;

    let completed = false;

    self.complete = () => {
        if (!completed) {
            completed = true;
        }
    };

    return self;
}

function TodoListCreated(args) {
    this.name = args.name;
}

function TodoAdded(todo) {
    this.todo = todo;
}

function TodoCompleted(id) {
    this.id = id;
}

describe('TodoList Tests', () => {
    describe('Creating a new Todo List', () => {
        let todoList;
        let expectedName = 'House Duties';

        todoList = new TodoList({
            name: expectedName,
        });

        it('adds a TodoListCreatedEvent', () => {
            todoList.uncommittedEvents().length.should.equal(1);

            let event = todoList.uncommittedEvents()[0];

            should(event.name).not.equal(undefined);

            event.name.should.equal(expectedName);

            todoList.name.should.equal(expectedName);
        });

        it('updates the version of the aggregate to 1', () => {
            todoList.aggregateVersion().should.equal(1);
        });
    });

    describe('Adding a todo', () => {
        let todoList;
        let expectedName = 'House Duties';
        todoList = new TodoList({
            name: expectedName,
        });

        todoList.add(new Todo({
            name: 'get the milk',
        }));

        it('Adds an uncommitted event of TodoAdded', () => {
            todoList.uncommittedEvents().length.should.equal(2);
        });

        describe('Completing a todo', () => {
            before((done) => {
                todoList.complete('get the milk', done);
            });

            it('Adds an uncommitted event of TodoCompleted', () => {
                todoList.uncommittedEvents().length.should.equal(3);
            });
        });
    });


    describe('Finding a todo', () => {
        let expectedName = 'get the milk';
        let expectedTodo = new Todo({
            name: expectedName,
        });
        let todoList = new TodoList({
            name: expectedName,
        });
        todoList.add(expectedTodo);


        it('by name', (done)=> {
            should(expectedTodo.name).equal(expectedName);
            todoList.findTodoByName(expectedName, (err, todo) => {
                should(err).equal(undefined);
                should(todo).equal(expectedTodo);
                done();
            });
        });

        it('by ID', (done) => {
            should(expectedTodo.name).equal(expectedName);
            todoList.findTodoByID(1, (err, todo) => {
                should(todo).equal(expectedTodo);
                done();
            });
        });
    });
});
