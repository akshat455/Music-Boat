/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const fastForwardNum = 10;

class Loop extends Command {
    get name() {
        return 'loop';
    }

    get usage() {
        return 'loop';
    }

    get description() {
        return 'Forwards The Song';
    }

    async run(msg,args) {
        
        try {
            const dispatcher = this.client.queue.get(msg.guild.id);
            let repeat = true;
            await dispatcher.player.play(dispatcher.player.track);
            const song = dispatcher.queue.shift();
            if (repeat) dispatcher.queue.push(song);
        } catch (e) {
            return console.log(e);
        }
    }
}
module.exports = Loop;
