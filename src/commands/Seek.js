/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

class Seek extends Command {
    get name() {
        return 'seek';
    }

    get usage() {
        return 'seek';
    }

    get description() {
        return 'Stops the playback';
    }

    async run(msg,args) {
        if (!msg.member.voice.channelID)
            return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
        const dispatcher = this.client.queue.get(msg.guild.id);

        if (!dispatcher)
            return await msg.channel.send('Nothing is playing in this guild.');
        if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
            return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');
        const duration = args[0];
        if (!duration)
            return msg.channel.send(util.embed().setAuthor(' |  You must provide duration to seek. Valid duration e.g. 1:34', msg.author.displayAvatarURL({ dynamic : true })));
        if (!durationPattern.test(duration))
            return msg.channel.send(util.embed().setAuthor(' |  You provided an invalid duration. Valid duration e.g. 1:34', msg.author.displayAvatarURL({ dynamic : true })));
    
        const durationMs = util.durationToMillis(duration);
        if (durationMs > dispatcher.current.info.length)
            return msg.channel.send(util.embed().setAuthor(' |  The duration you provide exceeds the duration of the current track', msg.author.displayAvatarURL({ dynamic : true })));
    
        try {
            await dispatcher.player.seekTo(durationMs);
            msg.channel.send(util.embed().setAuthor(` |  Seeked to ${util.millisToDuration(durationMs)}.`, msg.author.displayAvatarURL({ dynamic : true })));
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }


    }
}
module.exports = Seek; 
