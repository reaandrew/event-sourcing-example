require('should');

function TodoList(args){
    let uncommittedEvents = [];
    let self = {};
    let version = 0;
    let name;

    let handlers = {};
    handlers['handleTodoListCreated'] = (evt) =>{
        version = evt.version;
        name = evt.name;
    };

    if (args !== undefined && args.id === undefined){
        apply(new TodoListCreated(args));
    }

    function apply(evt){
        if(version == 0){
            evt.version = 1;
        }

        var eventName = evt.constructor.name;
        var method = 'handle'+eventName;
        handlers[method].call(self, evt);

        uncommittedEvents.push(evt);
    }

    self.uncommittedEvents = () => {
        return uncommittedEvents;
    };

    self.version = () => {
        return version;
    };

    self.add = (todo) => {
    };

    return self;
}

function Todo(){

}

function TodoListCreated(args){
    this.name = args.name;
}

describe('TodoList Tests', () => {

    let todoList;
    let expectedName = 'House Duties'

    describe('Creating a new Todo List', () => {
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
            todoList.version().should.equal(1);
        });

        describe('Adding a todo', () => {

        });
    });

});
