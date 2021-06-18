/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class ClearFilters extends Command {
    get name() {
        return 'clearfilters';
    }

    get usage() {
        return 'ClearFilters';
    }

    get description() {
        return 'Clear All The Filters Applied';
    }


    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        dispatcher.player.clearFilters();

        return msg.channel.send(util.embed().setDescription('**Cleard All Filters**'));
    }
}
module.exports = ClearFilters;
