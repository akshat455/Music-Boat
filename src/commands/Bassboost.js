/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Bassboost extends Command {
    get name() {
        return 'Bassboost';
    }

    get usage() {
        return 'Bassboost';
    }

    get description() {
        return 'custom bass';
    }


    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        if (isNaN(args[0])) return msg.channel.send('**Pease Type In A Number**');
    
        if (args[0] > 10 || args[0] < -10) {
            dispatcher.player.setEqualizer(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));
        }
        else dispatcher.player.setEqualizer(Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })));
    
        const embed = util.embed()
            .setAuthor(`Bassboost set to: ${args[0]}`);
                
        await msg.channel.send(embed);
    }
}
module.exports = Bassboost;
