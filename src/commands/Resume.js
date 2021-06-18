/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../config.json'); 
class Resume extends Command {
    get name() {
        return 'resume';
    }

    get usage() {
        return 'resume';
    }

    get description() {
        return 'Stops the playback';
    }

    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        dispatcher.queue.length = 0;
        await dispatcher.player.setPaused(false);
        return msg.channel.send(util.embed().setDescription('Player Is Now **Resumed**'));
    }
}
module.exports = Resume; 
