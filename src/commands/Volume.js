const Command = require('../abstract/Command.js');
const util = require('../../util');
class Volume extends Command {
    get name() {
        return 'volume';
    }

    get usage() {
        return 'volume [number]';
    }

    get description() {
        return 'Sets the volume of this playback.';
    }

    async run(msg, args) {
        const newVolume =  Number(args[0]);

        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        try {
            if (isNaN(newVolume)) {
                msg.channel.send(util.embed()
                    .setAuthor(' | Current volume ', msg.author.displayAvatarURL({ dynamic : true }))
                    .setDescription(`Current volume: \`${dispatcher.player.filters.volume * 100}\``)
                );
            } else {

                if (!msg.member.voice.channelID)
                    return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
                if (newVolume < 0 || newVolume > 1000)
                    return msg.channel.send(util.embed().setAuthor(' |  You can only set the volume from 0 to 400.', msg.author.displayAvatarURL({ dynamic : true })));

                await dispatcher.player.setVolume(newVolume / 100);
                msg.channel.send(util.embed()
                    .setDescription(`Volume set to \`${newVolume}\``));
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }          
    }
}
module.exports = Volume;
