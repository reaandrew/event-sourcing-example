require('should');

function TodoList(args){
    let uncommittedEvents = [];
    let self = {};
    let version = 0;
    let name;
    let todos = [];

    let handlers = {};
    handlers['handleTodoListCreated'] = (evt) =>{
        version = evt.version;
        name = evt.name;
    };

    handlers['handleTodoAdded'] = (evt) => {
        version = evt.version;
        todos.push(evt.todo);
    };

    if (args !== undefined && args.id === undefined){
        apply(new TodoListCreated(args));
    }

    function apply(evt){
        if(version == 0){
            evt.version = 1;
        }else{
            evt.version = 100;
        }

        var eventName = evt.constructor.name;
        var method = 'handle'+eventName;

        if (handlers[method] === undefined){
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

    return self;
}

function Todo(){

}

function TodoListCreated(args){
    this.name = args.name;
}

function TodoAdded(todo){
    this.todo = todo;
}

describe('TodoList Tests', () => {


    describe('Creating a new Todo List', () => {

        let todoList;
        let expectedName = 'House Duties'

        todoList  = new TodoList({
            name: expectedName
        });

        it('adds a TodoListCreatedEvent', () => {

            todoList.uncommittedEvents().length.should.equal(1);

            var event = todoList.uncommittedEvents()[0]

            should(event.name).not.equal(undefined);
                
            event.name.should.equal(expectedName);
        });

        it('updates the version of the aggregate to 1', () => {
            todoList.aggregateVersion().should.equal(1);
        });

    });

    describe('Adding a todo', () => {
        let todoList;
        let expectedName = 'House Duties'
        todoList  = new TodoList({
            name: expectedName
        });

        todoList.add(new Todo('get the milk'));

        it('Adds an uncommitted event of TodoAdded', () => {
            todoList.uncommittedEvents().length.should.equal(2);
        });
    });

});
