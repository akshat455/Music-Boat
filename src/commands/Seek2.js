/* eslint-disable linebreak-style */
const Command = require('../abstract/Command.js');
const util = require('../../util');
const formatDuration = require('../../models/songs');
class Seek2 extends Command {
    get name() {
        return 'seek2';
    }

    get usage() {
        return 'seek2';
    }

    get description() {
        return 'Basic ping and pong command';
    }

    async run(msg,args) {
        try {

            if (!msg.member.voice.channelID)
                return await msg.channel.send('Admiral, you are not in a voice channel to perform this');
            const dispatcher = this.client.queue.get(msg.guild.id);
            if (!dispatcher)
                return await msg.channel.send('Nothing is playing in this guild.');
            if (dispatcher.player.voiceConnection.voiceChannelID !== msg.member.voice.channelID)
                return await msg.channel.send('Teitoku, you are not in the same voice channel where I am.');

            if(isNaN(args[0])) return msg.reply(`Invalid number. Please provide a number in seconds.\nCorrect Usage: \`seek <seconds>\``);

            if(args[0] * 1000 >= dispatcher.current.info.length || args[0] < 0) return msg.channel.send('Cannot seek beyond length of song.');
            dispatcher.player.seekTo(args[0] * 1000);
        
            return msg.channel.send(`Seeked to ${args[0]}s`);
        } catch (e){
            msg.channel.send(`${e.message}`);
        }
    }
}
module.exports = Seek2;
