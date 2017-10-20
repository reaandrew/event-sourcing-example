let should = require('should');
let TodoList = require('../lib/TodoList');
let Todo = require('../lib/Todo');

describe('TodoList Tests', () => {
    let d = Date.now();
    Date.now = () => d;

    describe('Creating a new Todo List', () => {
        let todoList;
        let expectedName = 'House Duties';

        todoList = new TodoList({
            name: expectedName,
        });

        it('assigns an aggregateID', () => {
            should(todoList.aggregateID).not.equal(undefined);
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

        it('assigns an id', () => {
            should(todoList.uncommittedEvents()[0].eventId).not.equal(undefined);
        });

        it('assigns a timestamp', () => {
            should(todoList.uncommittedEvents()[0].timestamp).equal(d);
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

        it('assigns an id', () => {
            should(todoList.uncommittedEvents()[1].eventId).not.equal(undefined);
        });

        it('assigns a timestamp', () => {
            should(todoList.uncommittedEvents()[1].timestamp).equal(d);
        });

        describe('Completing a todo', () => {
            before((done) => {
                todoList.complete('get the milk', done);
            });

            it('Adds an uncommitted event of TodoCompleted', () => {
                todoList.uncommittedEvents().length.should.equal(3);
            });

            it('assigns an id', () => {
                should(todoList.uncommittedEvents()[2].eventId).not.equal(undefined);
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
