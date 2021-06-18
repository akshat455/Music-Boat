/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Rate extends Command {
    get name() {
        return 'rate';
    }

    get usage() {
        return 'rate';
    }

    get description() {
        return 'Basic ping and pong command';
    }


    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        if (isNaN(args[0])) return msg.channel.send(util.embed()
            .setAuthor(' |  Specify a number', msg.author.displayAvatarURL({ dynamic : true })));

        if (args[0] < 1) return msg.channel.send(util.embed()
            .setAuthor(' |  Speed must be greater than 0', msg.author.displayAvatarURL({ dynamic : true })));

        if (args[0] > 10) return msg.channel.send(util.embed()
            .setAuthor(' |  Speed must be less than 10', msg.author.displayAvatarURL({ dynamic : true })));

        dispatcher.player.setTimescale({
            'op': 'filters',
            'guildId': '...',
            'rate': args[0],

        });

        const embed = util.embed()
            .setDescription(`Set Rate to **${args[0]}**x`);
        return msg.channel.send(embed);
    }
}
module.exports = Rate;
