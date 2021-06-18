const EventEmitter = require('events');

class SenkuEvent extends  EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        if (this.constructor === SenkuEvent) throw new TypeError('Abstract class "SenkuEvent" cannot be instantiated directly.');
        if (this.name === undefined) throw new TypeError('Classes extending SenkuEvent must have a getter "name"');
        if (this.once === undefined) throw new TypeError('Classes extending SenkuEvent must have a getter "once"');
        if (this.run !== undefined) {
            if (this.run.constructor.name !== 'AsyncFunction')
                throw new TypeError('Classes extending SenkuEvent must implement "run" as async function');
        } else throw new TypeError('Classes extending SenkuEvent must implement an async function "run"');
        this.on('error', (error) => client.logger.error(error));
    }

    exec(...args) {
        this.run(...args)
            .catch(error => this.emit('error', error));
    }
}
module.exports = SenkuEvent;
