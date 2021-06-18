/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');

class Clear extends Command {
    get name() {
        return 'clear';
    }

    get usage() {
        return 'clear';
    }

    get description() {
        return 'clears The Queue';
    }

    async run(msg) {

        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        if(!dispatcher.queue[0]) return msg.channel.send('Teitoku, There Is Nothing In The Queue');
        var first = dispatcher.queue[0];
        dispatcher.queue = [];
        dispatcher.queue.push(first);
        msg.channel.send(util.embed().setDescription('cleared The Queue'));
    }
}
module.exports = Clear;
