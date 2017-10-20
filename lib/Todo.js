
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

module.exports = Todo;
