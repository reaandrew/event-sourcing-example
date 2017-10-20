require('should');

function TodoList(id){

    let uncommittedEvents = [];
    let self = {};

    if (id === undefined){
        uncommittedEvents.push(new TodoListCreated());
    }

    self.uncommittedEvents = () => {
        return uncommittedEvents;
    }

    self.add = (todo) => {
    };

    return self;
}

function Todo(){

}

function TodoListCreated(){

}

describe('something', () => {
    it('does something', () => {
        var todoList  = new TodoList();
        //todoList.add(new Todo('Get the milk'));

        todoList.uncommittedEvents().length.should.equal(1);
    });
});
