/* eslint-disable linebreak-style */

const Command = require('../abstract/Command.js');
const util = require('../../util');

class Rotation extends Command {
    get name() {
        return 'rotation';
    }

    get usage() {
        return 'Rotation';
    }

    get description() {
        return 'Surrounds the Audio';
    }


    async run(msg) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

        dispatcher.player.setRotation({
            'op': 'filters',
            'guildId': '...',
            'rotationHz': 0.9,

        });
    
        const embed = util.embed()
            .setAuthor('Enabled *EarRape*');
                
        await msg.channel.send(embed);
    }
}
module.exports = Rotation;
