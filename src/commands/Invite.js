/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');

class Clear extends Command {
    get name() {
        return 'invite';
    }

    get usage() {
        return 'invite';
    }

    get description() {
        return 'bot invite';
    }

    async run(msg) {
      msg.channel.send('https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=20442432&scope=bot')
    }
}
module.exports = Clear;
