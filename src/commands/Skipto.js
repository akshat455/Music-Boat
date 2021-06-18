/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');

class Skipto extends Command {
    get name() {
        return 'skipto';
    }

    get usage() {
        return 'skipto';
    }

    get description() {
        return 'Skips the currently playing song';
    }

    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        if (args[0] > dispatcher.queue.length || args[0] && !dispatcher.queue[args[0] - 1]) return msg.edit('Song not found');
        if (args[0] == 1) dispatcher.player.stopTrack();
        dispatcher.queue.splice(0, args[0] - 1);
        dispatcher.player.stopTrack();
    }
}
module.exports = Skipto;
