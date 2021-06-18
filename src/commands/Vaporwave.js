/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Vaporwave extends Command {
    get name() {
        return 'vaporwave';
    }

    get usage() {
        return 'Vaporwave';
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
  
        dispatcher.player.setGroupedFilters({
            op: 'filters',
            guildId:  msg.guild.id || msg.guild,
            equalizer: [
                { band: 1, gain: 0.3 },
                { band: 0, gain: 0.3 },
            ],
            timescale: { pitch: 0.5 },
            tremolo: { depth: 0.3, frequency: 14 },

        });
        msg.channel.send(util.embed().setDescription('Enabled **vaporwave**'));
    }
}
module.exports = Vaporwave;
