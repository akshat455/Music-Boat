/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Move extends Command {
    get name() {
        return 'shuffle';
    }

    get usage() {
        return 'shuffle';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.queue = util.shuffleArray(dispatcher.queue);
        msg.channel.send(util.embed().setDescription(' Queue Is Shuffled'));
    }
}
module.exports = Move;
